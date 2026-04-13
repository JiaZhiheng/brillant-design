/**
 * DragModule — 拖拽模块
 * 负责课程卡片拖拽、放置、复制/移动逻辑
 */
export class DragModule {
  constructor() {
    /** @type {HTMLElement|null} 当前拖拽源元素（模块内部属性，非全局变量） */
    this.source = null;
  }

  /**
   * 处理拖拽开始事件
   * 设置 effectAllowed 并存储 source 引用
   * @param {DragEvent} e
   */
  handleDragStart(e) {
    if (!e.target || !e.target.dataset || !e.target.dataset.effect) {
      return;
    }
    e.dataTransfer.effectAllowed = e.target.dataset.effect;
    this.source = e.target;
  }

  /**
   * 处理放置到表格单元格
   * 支持 copy（克隆课程卡片）和 move（移动课程卡片）两种效果
   * @param {DragEvent} e
   * @param {HTMLElement} dropNode - 目标放置节点（已通过 getDropNode 查找）
   */
  handleDrop(e, dropNode) {
    e.preventDefault();
    this.clearDropStyle();

    if (!this.source) {
      console.warn('DragModule: source 未初始化，忽略本次拖放操作');
      return;
    }

    if (!dropNode) {
      return;
    }

    if (dropNode !== this.source && dropNode.dataset.drop === 'copy') {
      if (dropNode.tagName === 'TD') {
        // 清空目标单元格
        while (dropNode.firstChild) {
          dropNode.removeChild(dropNode.firstChild);
        }

        if (this.source.dataset.effect === 'move') {
          dropNode.appendChild(this.source);
        } else if (this.source.dataset.effect === 'copy') {
          const clone = this.source.cloneNode(true);
          clone.dataset.effect = 'move';
          clone.draggable = true;
          dropNode.appendChild(clone);
        }
      }
    }
  }

  /**
   * 处理放置到卡片面板（回收移动的课程卡片）
   * @param {DragEvent} e
   */
  handleCardDrop(e) {
    e.preventDefault();
    if (this.source && this.source.dataset.effect === 'move') {
      this.source.parentNode.removeChild(this.source);
    }
  }

  /**
   * 切换所有 .item 元素的拖拽状态
   * @param {boolean} enabled - 是否启用拖拽
   */
  toggleDraggable(enabled) {
    document.querySelectorAll('.item').forEach((element) => {
      element.draggable = enabled;
      element.ondragstart = enabled
        ? (e) => this.handleDragStart(e)
        : null;
    });
  }

  /**
   * 清除所有具有 'drop-over' 类的节点的高亮样式
   */
  clearDropStyle() {
    document.querySelectorAll('.drop-over').forEach((node) => {
      node.classList.remove('drop-over');
    });
  }

  /**
   * 根据传入的节点向上遍历 DOM 树，查找具有 data-drop 属性的最近祖先节点
   * @param {HTMLElement} node
   * @returns {HTMLElement|undefined}
   */
  getDropNode(node) {
    while (node) {
      if (node.dataset && node.dataset.drop) {
        return node;
      }
      node = node.parentNode;
    }
  }

  /**
   * 处理拖拽进入目标区域事件，为有效放置目标添加高亮样式
   * @param {DragEvent} e
   */
  handleDragEnter(e) {
    this.clearDropStyle();
    const dropNode = this.getDropNode(e.target);
    if (!dropNode) {
      return;
    }
    if (
      e.dataTransfer.effectAllowed === 'move' ||
      e.dataTransfer.effectAllowed === dropNode.dataset.drop
    ) {
      dropNode.classList.add('drop-over');
    }
  }

  /**
   * 处理拖拽经过事件，阻止默认行为以允许放置
   * @param {DragEvent} e
   */
  handleDragOver(e) {
    e.preventDefault();
  }
}
