/**
 * ArrangeEngine — 排课引擎
 * 实现带约束的自动排课算法：
 * - 同一天同课最多两次（需求 3.1）
 * - 主科课程分散到不同天（需求 3.2）
 * - 相邻课时不重复（需求 3.3）
 * - 仅对 data-drop="copy" 单元格排课（需求 3.4）
 * - 课程不足时均匀分配并提示（需求 3.5）
 */
export class ArrangeEngine {
  /**
   * @param {import('./toast-system.js').ToastSystem} toast
   * @param {import('./drag-module.js').DragModule} dragModule
   */
  constructor(toast, dragModule) {
    this.toast = toast;
    this.dragModule = dragModule;
  }

  /**
   * 执行排课：获取课程卡片和可用时间槽，运行约束分配算法，填充单元格
   */
  arrange() {
    // 1. 收集所有可用课程卡片
    const cardItems = Array.from(document.querySelectorAll('.card .item'));
    if (cardItems.length === 0) {
      this.toast.warning('没有可用的课程卡片');
      return;
    }

    // 2. 获取所有可排课的单元格
    const allSlots = Array.from(document.querySelectorAll('td[data-drop="copy"]'));
    if (allSlots.length === 0) {
      return;
    }

    // 3. 将单元格按列（天）组织
    const slotsByDay = this._organizeSlotsByDay(allSlots);
    const totalSlots = allSlots.length;
    const numCourses = cardItems.length;

    // 4. 构建课程池：均匀分配每门课程
    const coursePool = this._buildCoursePool(cardItems, totalSlots);

    if (numCourses < totalSlots) {
      this.toast.warning('课程数量不足，已尽可能均匀分配');
    }

    // 5. 洗牌课程池
    this._shuffle(coursePool);

    // 6. 按天、按行迭代分配课程
    // daySchedule 记录每天已分配的课程名列表（按槽位顺序）
    const daySchedules = new Map();
    const dayKeys = Array.from(slotsByDay.keys()).sort((a, b) => a - b);
    for (const dayIndex of dayKeys) {
      daySchedules.set(dayIndex, []);
    }

    // 迭代：按天、按槽位顺序
    for (const dayIndex of dayKeys) {
      const daySlots = slotsByDay.get(dayIndex);
      for (let slotIdx = 0; slotIdx < daySlots.length; slotIdx++) {
        const slot = daySlots[slotIdx];
        const daySchedule = daySchedules.get(dayIndex);

        // 尝试从池中找到满足所有约束的课程
        let placed = false;
        for (let i = 0; i < coursePool.length; i++) {
          const candidate = coursePool[i];
          if (
            this.checkDailyLimit(daySchedule, candidate.name) &&
            this.checkAdjacentSlot(daySchedule, slotIdx, candidate.name) &&
            this._checkMajorSpread(daySchedules, dayIndex, candidate, dayKeys)
          ) {
            // 放置课程
            this._placeCard(slot, candidate.element);
            daySchedule.push(candidate.name);
            coursePool.splice(i, 1);
            placed = true;
            break;
          }
        }

        // 如果没有完美匹配，放宽约束选择最佳可用选项
        if (!placed && coursePool.length > 0) {
          const bestIdx = this._findBestCandidate(coursePool, daySchedule, slotIdx, daySchedules, dayIndex, dayKeys);
          const candidate = coursePool[bestIdx];
          this._placeCard(slot, candidate.element);
          daySchedule.push(candidate.name);
          coursePool.splice(bestIdx, 1);
        } else if (!placed) {
          // 池已空，清空该单元格
          while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
          }
          daySchedule.push(null);
        }
      }
    }

    // 7. 刷新拖拽状态
    this.dragModule.toggleDraggable(true);
  }

  /**
   * 约束检查：同一天同一课程最多出现两次
   * @param {Array<string|null>} daySchedule - 当天已排课程名列表
   * @param {string} courseName - 待检查的课程名
   * @returns {boolean} true 表示未超限（可以放置）
   */
  checkDailyLimit(daySchedule, courseName) {
    let count = 0;
    for (const name of daySchedule) {
      if (name === courseName) {
        count++;
      }
    }
    return count < 2;
  }

  /**
   * 约束检查：相邻课时不重复
   * @param {Array<string|null>} daySchedule - 当天已排课程名列表
   * @param {number} slotIndex - 当前槽位索引
   * @param {string} courseName - 待检查的课程名
   * @returns {boolean} true 表示不与前一个相邻槽位重复
   */
  checkAdjacentSlot(daySchedule, slotIndex, courseName) {
    if (slotIndex === 0) {
      return true;
    }
    return daySchedule[slotIndex - 1] !== courseName;
  }

  /**
   * 获取某天的已排课程名列表
   * @param {NodeListOf<HTMLElement>|Array<HTMLElement>} slots - 所有 data-drop="copy" 单元格
   * @param {number} dayIndex - 天（列）索引
   * @returns {Array<string>} 该天已排课程名列表
   */
  getDaySchedule(slots, dayIndex) {
    const slotsByDay = this._organizeSlotsByDay(Array.from(slots));
    const daySlots = slotsByDay.get(dayIndex) || [];
    const result = [];
    for (const slot of daySlots) {
      const item = slot.querySelector('.item');
      if (item) {
        result.push(item.textContent.trim());
      }
    }
    return result;
  }

  /**
   * 主科分散约束检查（内部方法）
   * 主科课程（语文、数学、英语，data-type="major"）应尽量分散到不同天
   * 如果该主科在当天已出现过，且还有其他天没有该主科，则不建议放在当天
   * @param {Map<number, Array<string|null>>} daySchedules - 所有天的已排课程
   * @param {number} currentDay - 当前天索引
   * @param {Object} candidate - 候选课程 { name, type, element }
   * @param {Array<number>} dayKeys - 所有天的索引列表
   * @returns {boolean} true 表示满足分散约束
   */
  _checkMajorSpread(daySchedules, currentDay, candidate, dayKeys) {
    if (candidate.type !== 'major') {
      return true;
    }

    const currentDaySchedule = daySchedules.get(currentDay);
    const currentDayCount = currentDaySchedule.filter(n => n === candidate.name).length;

    // 如果当天还没有这门主科，允许放置
    if (currentDayCount === 0) {
      return true;
    }

    // 当天已有这门主科，检查是否还有其他天没有这门主科
    for (const dayKey of dayKeys) {
      if (dayKey === currentDay) continue;
      const otherDaySchedule = daySchedules.get(dayKey);
      const otherDayCount = otherDaySchedule.filter(n => n === candidate.name).length;
      if (otherDayCount === 0) {
        // 还有其他天没有这门主科，不建议放在当天
        return false;
      }
    }

    // 所有天都已有这门主科，允许放置
    return true;
  }

  /**
   * 将单元格按列（天）组织
   * 通过计算每个 td[data-drop="copy"] 在同行中的序号来确定属于哪一天
   * @param {Array<HTMLElement>} slots - 所有 data-drop="copy" 单元格
   * @returns {Map<number, Array<HTMLElement>>} 按天索引分组的单元格
   */
  _organizeSlotsByDay(slots) {
    const slotsByDay = new Map();

    for (const slot of slots) {
      const row = slot.parentElement;
      if (!row) continue;

      // 找到该 slot 在同行所有 data-drop="copy" 单元格中的索引
      // 这样无论行是否有 th[rowspan]，天索引都是一致的
      const copyCells = Array.from(row.querySelectorAll('td[data-drop="copy"]'));
      const dayIndex = copyCells.indexOf(slot);
      if (dayIndex < 0) continue;

      if (!slotsByDay.has(dayIndex)) {
        slotsByDay.set(dayIndex, []);
      }
      slotsByDay.get(dayIndex).push(slot);
    }

    return slotsByDay;
  }

  /**
   * 构建课程池：为均匀分配，每门课程重复 roughly (totalSlots / numCourses) 次
   * @param {Array<HTMLElement>} cardItems - 课程卡片 DOM 元素列表
   * @param {number} totalSlots - 总可用槽位数
   * @returns {Array<{name: string, type: string, colorClass: string, element: HTMLElement}>}
   */
  _buildCoursePool(cardItems, totalSlots) {
    const courses = cardItems.map(el => ({
      name: el.textContent.trim(),
      type: el.dataset.type || '',
      colorClass: Array.from(el.classList).find(c => c !== 'item' && c !== 'show-control-icon') || '',
      element: el
    }));

    const pool = [];
    const numCourses = courses.length;
    const baseCount = Math.floor(totalSlots / numCourses);
    let remainder = totalSlots % numCourses;

    for (const course of courses) {
      const count = baseCount + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      for (let i = 0; i < count; i++) {
        pool.push({ ...course });
      }
    }

    return pool;
  }

  /**
   * Fisher-Yates 洗牌算法
   * @param {Array} arr
   */
  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /**
   * 在约束无法完全满足时，找到最佳候选课程
   * 优先级：相邻不重复 > 每天限制 > 主科分散
   * @returns {number} 最佳候选在 pool 中的索引
   */
  _findBestCandidate(pool, daySchedule, slotIdx, daySchedules, dayIndex, dayKeys) {
    let bestIdx = 0;
    let bestScore = -1;

    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[i];
      let score = 0;

      // 相邻不重复（权重最高）
      if (this.checkAdjacentSlot(daySchedule, slotIdx, candidate.name)) {
        score += 4;
      }

      // 每天限制
      if (this.checkDailyLimit(daySchedule, candidate.name)) {
        score += 2;
      }

      // 主科分散
      if (this._checkMajorSpread(daySchedules, dayIndex, candidate, dayKeys)) {
        score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }

      // 满分直接返回
      if (score === 7) {
        return i;
      }
    }

    return bestIdx;
  }

  /**
   * 将课程卡片克隆放入目标单元格
   * @param {HTMLElement} slot - 目标 td 单元格
   * @param {HTMLElement} sourceElement - 源课程卡片元素
   */
  _placeCard(slot, sourceElement) {
    // 清空目标单元格
    while (slot.firstChild) {
      slot.removeChild(slot.firstChild);
    }

    // 克隆源元素
    const clone = sourceElement.cloneNode(true);
    clone.dataset.effect = 'move';
    clone.draggable = true;

    slot.appendChild(clone);
  }
}
