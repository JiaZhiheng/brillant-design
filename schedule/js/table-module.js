/**
 * TableModule — 表格操作模块
 * 负责表格行列增删、合并/拆分、单元格创建等操作
 */
export class TableModule {
  /**
   * @param {object} editModule - EditModule 实例，用于为动态创建的单元格绑定 dblclick 编辑事件
   */
  constructor(editModule) {
    this.editModule = editModule;
  }

  /**
   * 删除列（原 closeColumn）
   * @param {number} index - 列索引（cellIndex）
   */
  deleteColumn(index) {
    const table = document.querySelector('table');
    Array.from(table.rows).forEach((row, rowIndex) => {
      if (index === 1) {
        if (row.cells[row.cells.length - 1].hasAttribute('colspan')) {
          const colspan = parseInt(row.cells[row.cells.length - 1].getAttribute('colspan'), 10);
          if (colspan > 1) {
            row.cells[row.cells.length - 1].setAttribute('colspan', colspan - 1);
          } else {
            row.remove();
          }
        } else {
          if (row.cells[0].hasAttribute('rowspan')) {
            row.cells[index + 2].setAttribute('data-controlable', 'merge');
            row.cells[index + 2].classList.add('show-control-icon');
            row.cells[index + 2].addEventListener('click', (event) => {
              this.handleCellClick(event, 'bottom-left', (e) => this.merge(e));
            });
            row.deleteCell(index + 1);
          } else {
            if (rowIndex === 0) {
              row.deleteCell(index);
            } else {
              row.cells[index + 1].setAttribute('data-controlable', 'merge');
              row.cells[index + 1].classList.add('show-control-icon');
              row.cells[index + 1].addEventListener('click', (event) => {
                this.handleCellClick(event, 'bottom-left', (e) => this.merge(e));
              });
              row.deleteCell(index);
            }
          }
        }
      } else {
        if (row.cells[row.cells.length - 1].hasAttribute('colspan')) {
          const colspan = parseInt(row.cells[row.cells.length - 1].getAttribute('colspan'), 10);
          if (colspan > 1) {
            row.cells[row.cells.length - 1].setAttribute('colspan', colspan - 1);
          } else {
            row.remove();
          }
        } else {
          row.deleteCell(index);
        }
      }
    });
  }

  /**
   * 插入列（原 addColumn）
   * @param {number} index - 列索引（cellIndex）
   */
  insertColumn(index) {
    const table = document.querySelector('table');
    Array.from(table.rows).forEach((row, rowIndex) => {
      if (rowIndex === 0) {
        const th = document.createElement('th');
        th.className = 'controlable editable show-control-icon';
        th.textContent = '星期几';
        if (this.editModule) {
          th.addEventListener('dblclick', (e) => this.editModule.handleEditableEvent(e));
        }
        th.addEventListener('click', (event) => { this.cellEvent(event, 'column'); });
        row.insertBefore(th, row.cells[index + 1] || null);
      } else {
        if (row.cells[row.cells.length - 1].hasAttribute('colspan')) {
          const lastCell = row.cells[row.cells.length - 1];
          const colspanValue = parseInt(lastCell.getAttribute('colspan'), 10);
          lastCell.setAttribute('colspan', colspanValue + 1);
        } else {
          row.insertBefore(
            this.createCell(),
            row.cells[0].hasAttribute('rowspan')
              ? row.cells[index + 2]
              : row.cells[index + 1] || null
          );
        }
      }
    });
  }

  /**
   * 删除行（原 closeRow）
   * @param {number} index - 行索引（sectionRowIndex）
   */
  deleteRow(index) {
    const table = document.querySelector('table');
    Array.from(table.rows).forEach((row, rowIndex) => {
      if (rowIndex === index + 1) {
        let rowspan;
        if (row.cells[0].getAttribute('rowspan')) {
          rowspan = parseInt(row.cells[0].getAttribute('rowspan'), 10);
          if (rowspan > 1) {
            row.cells[0].setAttribute('rowspan', rowspan - 1);
            const newTh = row.cells[0].cloneNode(true);
            newTh.className = 'controlable editable show-control-icon';
            newTh.setAttribute('contenteditable', 'true');
            newTh.setAttribute('rowspan', rowspan - 1);
            newTh.addEventListener('click', (event) => { this.cellEvent(event, 'th'); });
            row.nextElementSibling.insertBefore(newTh, row.nextElementSibling.cells[0]);
            row.remove();
          } else {
            row.remove();
          }
        } else {
          let prevRowspanIndex = index;
          while (prevRowspanIndex >= 0 && !table.rows[prevRowspanIndex].cells[0].hasAttribute('rowspan')) {
            prevRowspanIndex--;
          }
          const prevRowspan = table.rows[prevRowspanIndex].cells[0];
          rowspan = parseInt(prevRowspan.getAttribute('rowspan'), 10);
          prevRowspan.setAttribute('rowspan', rowspan - 1);
          row.remove();
        }
      }
    });
  }

  /**
   * 插入行（原 addRow）
   * @param {number} index - 行索引（sectionRowIndex）
   */
  insertRow(index) {
    const table = document.querySelector('table');
    Array.from(table.rows).forEach((row, rowIndex) => {
      if (rowIndex === index + 1) {
        if (row.cells[0].getAttribute('rowspan')) {
          row.cells[0].setAttribute('rowspan', parseInt(row.cells[0].getAttribute('rowspan'), 10) + 1);
        } else {
          let prevRowspanIndex = index;
          while (prevRowspanIndex >= 0 && !table.rows[prevRowspanIndex].cells[0].hasAttribute('rowspan')) {
            prevRowspanIndex--;
          }
          const prevRowspan = table.rows[prevRowspanIndex].cells[0];
          const rowspan = parseInt(prevRowspan.getAttribute('rowspan'), 10);
          prevRowspan.setAttribute('rowspan', rowspan + 1);
        }
        row.parentNode.insertBefore(this.createDeputyTr(), row.nextElementSibling);
      }
    });
  }

  /**
   * 删除时段分组（原 closeTh）
   * @param {HTMLElement} th - 时段分组的 th 元素
   */
  deleteSection(th) {
    const table = document.querySelector('table');
    const rowIndex = th.parentNode.sectionRowIndex;
    const rowspan = th.getAttribute('rowspan');
    for (let i = 0; i < rowspan; i++) {
      table.rows[rowIndex + 1].remove();
    }
  }

  /**
   * 插入时段分组（原 addTh）
   * @param {HTMLElement} th - 时段分组的 th 元素
   */
  insertSection(th) {
    const table = document.querySelector('table');
    const rowspan = th.getAttribute('rowspan');
    const rowIndex = th.parentNode.sectionRowIndex;
    table.rows[rowIndex + Number(rowspan)].after(this.createMainTr());
  }

  /**
   * 合并单元格 — 将一行中的多个 data-drop="copy" 单元格合并为一个 colspan 单元格
   * @param {Event} event
   */
  merge(event) {
    const cell = event.currentTarget;
    const index = cell.parentNode.sectionRowIndex;
    const table = document.querySelector('table');
    Array.from(table.rows).forEach((row, rowIndex) => {
      if (rowIndex === index + 1) {
        const cells = Array.from(row.cells);
        cells.forEach((c, cellIndex) => {
          if (row.cells[0].getAttribute('rowspan')) {
            if (cellIndex > 1) {
              row.deleteCell(-1);
            }
          } else {
            if (cellIndex > 0) {
              row.deleteCell(-1);
            }
          }
        });
        const longCell = this.createLongCell(true);
        row.appendChild(longCell);
      }
    });
  }

  /**
   * 拆分单元格 — 将一个 colspan 单元格拆分为多个独立的 data-drop="copy" 单元格
   * @param {Event} event
   */
  split(event) {
    const cell = event.currentTarget;
    const index = cell.parentNode.sectionRowIndex;
    const table = document.querySelector('table');
    Array.from(table.rows).forEach((row, rowIndex) => {
      if (rowIndex === index + 1) {
        const lastCell = row.cells[row.cells.length - 1];
        const colspanValue = parseInt(lastCell.getAttribute('colspan'), 10);
        row.deleteCell(-1);
        for (let i = 0; i < colspanValue; i++) {
          if (i === 0) {
            row.appendChild(this.createCell(true));
          } else {
            row.appendChild(this.createCell(false));
          }
        }
      }
    });
  }

  /**
   * 合并标记 — 为每行中第一个 data-drop="copy" 单元格标记 data-controlable="merge"
   */
  markMerge() {
    document.querySelectorAll('table tbody tr').forEach((tr) => {
      const firstCopyCell = tr.querySelector('td[data-drop="copy"]');
      if (firstCopyCell) {
        firstCopyCell.setAttribute('data-controlable', 'merge');
      }
    });
  }

  /**
   * 分解标记 — 为每行中带有 colspan 的单元格标记 data-controlable="split"
   */
  markSplit() {
    document.querySelectorAll('table tbody tr').forEach((tr) => {
      const firstCopyCell = tr.querySelector('[colspan]');
      if (firstCopyCell) {
        firstCopyCell.setAttribute('data-controlable', 'split');
      }
    });
  }

  /**
   * 创建普通单元格（td，data-drop="copy"）
   * @param {boolean} control - 是否添加 data-controlable="merge" 及控制图标
   * @returns {HTMLTableCellElement}
   */
  createCell(control = false) {
    const cell = document.createElement('td');
    cell.setAttribute('data-drop', 'copy');
    if (control) {
      cell.setAttribute('data-controlable', 'merge');
      cell.classList.add('show-control-icon');
      cell.addEventListener('click', (event) => {
        this.handleCellClick(event, 'bottom-left', (e) => this.merge(e));
      });
    }
    return cell;
  }

  /**
   * 创建长单元格（td，colspan 匹配表头列数）
   * @param {boolean} control - 是否添加 data-controlable="split" 及控制图标
   * @returns {HTMLTableCellElement}
   */
  createLongCell(control = false) {
    const table = document.querySelector('table');
    const row = table.rows[0];
    const length = row.cells.length;
    const cell = document.createElement('td');
    cell.classList.add('editable');
    cell.setAttribute('colspan', length - 1);
    if (control) {
      cell.setAttribute('data-controlable', 'split');
      cell.classList.add('show-control-icon');
      cell.addEventListener('click', (event) => {
        this.handleCellClick(event, 'bottom-left', (e) => this.split(e));
      });
      if (this.editModule) {
        cell.addEventListener('dblclick', (e) => this.editModule.handleEditableEvent(e));
      }
    }
    return cell;
  }

  /**
   * 创建时间格（td，用于显示时间段）
   * @returns {HTMLTableCellElement}
   */
  createTimeCell() {
    const cell = document.createElement('td');
    cell.className = 'controlable editable show-control-icon';
    cell.textContent = '00:00-00:00';
    cell.addEventListener('click', (event) => { this.cellEvent(event, 'row'); });
    if (this.editModule) {
      cell.addEventListener('dblclick', (e) => this.editModule.handleEditableEvent(e));
    }
    return cell;
  }

  /**
   * 创建时段格（th，用于时段分组标题，如"上午"、"下午"）
   * @returns {HTMLTableHeaderCellElement}
   */
  createPeriodCell() {
    const cell = document.createElement('th');
    cell.className = 'controlable editable show-control-icon';
    cell.setAttribute('rowspan', 1);
    cell.addEventListener('click', (event) => { this.cellEvent(event, 'th'); });
    if (this.editModule) {
      cell.addEventListener('dblclick', (e) => this.editModule.handleEditableEvent(e));
    }
    return cell;
  }

  /**
   * 创建主行（包含时段格 + 时间格 + 数据单元格）
   * @returns {HTMLTableRowElement}
   */
  createMainTr() {
    const table = document.querySelector('table');
    const tr = document.createElement('tr');
    for (let i = 0; i < table.rows[0].cells.length + 1; i++) {
      if (i === 0) {
        tr.appendChild(this.createPeriodCell());
      } else if (i === 1) {
        tr.appendChild(this.createTimeCell());
      } else if (i === 2) {
        tr.appendChild(this.createCell(true));
      } else {
        tr.appendChild(this.createCell(false));
      }
    }
    return tr;
  }

  /**
   * 创建副行（仅包含时间格 + 数据单元格，无时段格）
   * @returns {HTMLTableRowElement}
   */
  createDeputyTr() {
    const table = document.querySelector('table');
    const tr = document.createElement('tr');
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      if (i === 0) {
        tr.appendChild(this.createTimeCell());
      } else if (i === 1) {
        tr.appendChild(this.createCell(true));
      } else {
        tr.appendChild(this.createCell(false));
      }
    }
    return tr;
  }

  /**
   * 单元格点击事件 — 根据点击位置判断执行删除或插入操作
   * 右上角（伪元素位置）= 删除操作，右下角 = 插入操作
   * @param {Event} event
   * @param {'column'|'row'|'th'} type - 操作类型
   */
  cellEvent(event, type) {
    const cell = event.currentTarget;
    let cellIndex;
    if (type === 'column') {
      cellIndex = cell.cellIndex;
    } else if (type === 'row') {
      cellIndex = cell.parentNode.sectionRowIndex;
    }

    const rect = cell.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pseudoSize = 16;

    // 右上角 = 删除
    if (x > rect.width - pseudoSize && y < pseudoSize) {
      if (type === 'column') {
        this.deleteColumn(cellIndex);
      } else if (type === 'row') {
        this.deleteRow(cellIndex);
      } else if (type === 'th') {
        this.deleteSection(cell);
      }
    }

    // 右下角 = 插入
    if (x > rect.width - pseudoSize && y > rect.height - pseudoSize) {
      if (type === 'column') {
        this.insertColumn(cellIndex);
      } else if (type === 'row') {
        this.insertRow(cellIndex);
      } else if (type === 'th') {
        this.insertSection(cell);
      }
    }
  }

  /**
   * 检测点击位置是否在指定伪元素区域，是则触发回调
   * @param {Event} event
   * @param {'top-left'|'bottom-left'|'top-right'|'bottom-right'} position - 目标位置
   * @param {Function} triggerEvent - 位置匹配时触发的回调函数
   */
  handleCellClick(event, position, triggerEvent) {
    const item = event.currentTarget;
    const rect = item.getBoundingClientRect();
    const pseudoSize = 16;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let isInTargetPosition = false;
    switch (position) {
      case 'top-left':
        isInTargetPosition = x < pseudoSize && y < pseudoSize;
        break;
      case 'bottom-left':
        isInTargetPosition = x < pseudoSize && y > rect.height - pseudoSize;
        break;
      case 'top-right':
        isInTargetPosition = x > rect.width - pseudoSize && y < pseudoSize;
        break;
      case 'bottom-right':
        isInTargetPosition = x > rect.width - pseudoSize && y > rect.height - pseudoSize;
        break;
    }
    if (isInTargetPosition) {
      triggerEvent(event);
    }
  }

  /**
   * 添加新课程卡片到卡片面板
   */
  addCard() {
    const card = document.querySelector('.card');
    const newCourse = document.createElement('div');
    const number = document.querySelectorAll('.item').length;
    newCourse.setAttribute('data-effect', 'copy');
    newCourse.setAttribute('draggable', 'false');
    newCourse.classList.add('item', 'show-control-icon');
    newCourse.textContent = '新课程';
    const colorClasses = [
      'magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
      'green', 'cyan', 'blue', 'geekblue', 'purple',
      'success', 'processing', 'error', 'warning'
    ];
    const randomColorClass = colorClasses[number % colorClasses.length];
    newCourse.classList.add(randomColorClass);
    if (this.editModule) {
      newCourse.addEventListener('dblclick', (e) => this.editModule.handleEditableEvent(e));
    }
    newCourse.addEventListener('click', (e) => this.removeCard(e));

    const addButton = card.querySelector('button');
    card.insertBefore(newCourse, addButton);
  }

  /**
   * 从卡片面板移除课程卡片（点击右上角伪元素删除图标）
   * @param {Event} event
   */
  removeCard(event) {
    const item = event.currentTarget;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pseudoSize = 16;
    // 检查是否点击在了右上角的伪元素上
    if (x > rect.width - pseudoSize && y < pseudoSize) {
      item.remove();
    }
  }
}
