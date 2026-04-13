/**
 * EventManager — 事件管理模块
 * 统一管理所有 DOM 事件绑定，采用事件委托模式
 * DOM 替换后通过 rebindAll 重新绑定所有事件
 *
 * 需求: 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.2, 5.3
 */

export class EventManager {
  /**
   * @param {object} modules - 所有模块实例
   * @param {import('./drag-module.js').DragModule} modules.dragModule
   * @param {import('./edit-module.js').EditModule} modules.editModule
   * @param {import('./table-module.js').TableModule} modules.tableModule
   * @param {import('./arrange-engine.js').ArrangeEngine} modules.arrangeEngine
   * @param {import('./state-manager.js').StateManager} modules.stateManager
   * @param {import('./undo-manager.js').UndoManager} modules.undoManager
   * @param {import('./toast-system.js').ToastSystem} modules.toast
   */
  constructor({ dragModule, editModule, tableModule, arrangeEngine, stateManager, undoManager, toast }) {
    this.dragModule = dragModule;
    this.editModule = editModule;
    this.tableModule = tableModule;
    this.arrangeEngine = arrangeEngine;
    this.stateManager = stateManager;
    this.undoManager = undoManager;
    this.toast = toast;

    /** @type {HTMLElement|null} */
    this.container = null;
    /** @type {HTMLElement|null} */
    this.card = null;
  }

  /**
   * 初始绑定所有事件，在 DOMContentLoaded 时调用一次
   */
  bindAll() {
    this.container = document.querySelector('.container');
    this.card = document.querySelector('.card');

    this.bindDragEvents();
    this.bindTableEvents();
    this.bindEditEvents();
    this.bindKeyboardShortcuts();
    this.bindControlButtons();
    this.bindButtonInfo();
  }

  /**
   * DOM 替换后重新绑定所有事件
   * 在 load/init/undo/redo 等操作导致 DOM 大规模替换后调用
   */
  rebindAll() {
    // 重新查询 DOM 元素
    this.container = document.querySelector('.container');
    this.card = document.querySelector('.card');

    // 重新绑定拖拽事件（card 面板上的事件）
    this.bindDragEvents();
    // 重新绑定表格事件
    this.bindTableEvents();
    // 重新绑定卡片项按钮事件
    this.bindEditEvents();

    // 恢复拖拽模式
    this.dragModule.toggleDraggable(true);
    // 关闭编辑模式
    this.editModule.toggleEditable(false);
    // 重新标记合并/拆分
    this.tableModule.markMerge();
    this.tableModule.markSplit();
  }

  /**
   * 绑定拖拽事件 — 使用事件委托在 container 上统一管理
   */
  bindDragEvents() {
    if (!this.container || !this.card) return;

    // container 上的拖拽开始事件
    this.container.ondragstart = (e) => {
      this.dragModule.handleDragStart(e);
    };

    // container 上的拖拽经过事件
    this.container.ondragover = (e) => {
      this.dragModule.handleDragOver(e);
    };

    // container 上的拖拽进入事件
    this.container.ondragenter = (e) => {
      this.dragModule.handleDragEnter(e);
    };

    // container 上的放置事件 — 处理放置到表格单元格
    this.container.ondrop = (e) => {
      e.preventDefault();
      this.dragModule.clearDropStyle();
      const dropNode = this.dragModule.getDropNode(e.target);
      if (dropNode && dropNode.dataset.drop === 'copy' && this.undoManager) {
        this.undoManager.saveSnapshot();
      }
      this.dragModule.handleDrop(e, dropNode);
    };

    // card 面板上的拖拽经过事件
    this.card.ondragover = (e) => {
      e.preventDefault();
    };

    // card 面板上的放置事件 — 回收移动的课程卡片
    this.card.ondrop = (e) => {
      this.dragModule.handleCardDrop(e);
    };
  }

  /**
   * 绑定表格操作事件 — 使用事件委托或直接绑定
   */
  bindTableEvents() {
    // 绑定列头点击事件
    document.querySelectorAll('thead th.controlable').forEach((th) => {
      th.addEventListener('click', (event) => {
        if (this.undoManager) this.undoManager.saveSnapshot();
        this.tableModule.cellEvent(event, 'column');
      });
    });

    // 绑定副行头（td.controlable）点击事件
    document.querySelectorAll('tbody td.controlable').forEach((td) => {
      td.addEventListener('click', (event) => {
        if (this.undoManager) this.undoManager.saveSnapshot();
        this.tableModule.cellEvent(event, 'row');
      });
    });

    // 绑定主行头（th.controlable）点击事件
    document.querySelectorAll('tbody th.controlable').forEach((th) => {
      th.addEventListener('click', (event) => {
        if (this.undoManager) this.undoManager.saveSnapshot();
        this.tableModule.cellEvent(event, 'th');
      });
    });

    // 绑定合并单元格点击事件
    document.querySelectorAll('[data-controlable="merge"]').forEach((td) => {
      td.addEventListener('click', (event) => {
        this.tableModule.handleCellClick(event, 'bottom-left', (e) => {
          if (this.undoManager) this.undoManager.saveSnapshot();
          this.tableModule.merge(e);
        });
      });
    });

    // 绑定拆分单元格点击事件
    document.querySelectorAll('[data-controlable="split"]').forEach((td) => {
      td.addEventListener('click', (event) => {
        this.tableModule.handleCellClick(event, 'bottom-left', (e) => {
          if (this.undoManager) this.undoManager.saveSnapshot();
          this.tableModule.split(e);
        });
      });
    });
  }

  /**
   * 绑定卡片项点击事件（删除卡片）
   */
  bindEditEvents() {
    document.querySelectorAll('.card .item').forEach((item) => {
      item.addEventListener('click', (e) => this.tableModule.removeCard(e));
    });
  }

  /**
   * 绑定键盘快捷键
   * Ctrl+Z (Cmd+Z on Mac) → 撤销
   * Ctrl+Y (Cmd+Shift+Z on Mac) → 重做
   */
  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

      // 撤销: Ctrl+Z / Cmd+Z
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undoManager.undo();
        return;
      }

      // 重做: Ctrl+Y / Cmd+Shift+Z
      if (isMac) {
        if (e.metaKey && e.shiftKey && e.key === 'z') {
          e.preventDefault();
          this.undoManager.redo();
        }
      } else {
        if (e.ctrlKey && e.key === 'y') {
          e.preventDefault();
          this.undoManager.redo();
        }
      }
    });
  }

  /**
   * 绑定控制面板按钮事件 — 替代所有内联 onclick
   */
  bindControlButtons() {
    const bind = (selector, handler) => {
      const btn = document.querySelector(selector);
      if (btn) {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', handler);
      }
    };

    // 排课
    bind('.button.arrange', () => {
      this.undoManager.saveSnapshot();
      this.arrangeEngine.arrange();
    });

    // 清空
    bind('.button.empty', () => {
      this.undoManager.saveSnapshot();
      this.empty();
    });

    // 着色
    bind('.button.coloring', () => {
      this.coloring();
    });

    // 褪色
    bind('.button.fade', () => {
      this.fade();
    });

    // 打印
    bind('.button.print', () => {
      this.print();
    });

    // 拖拽模式切换
    bind('.button.drag', () => {
      this.drag();
    });

    // 编辑模式切换
    bind('.button.edit', () => {
      this.edit();
    });

    // 存档
    bind('.button.archive', () => {
      this.stateManager.archive();
    });

    // 读档
    bind('.button.load', () => {
      this.stateManager.load();
    });

    // 初始化
    bind('.button.init', () => {
      this.stateManager.init();
    });

    // 撤销
    bind('.button.undo', () => {
      this.undoManager.undo();
    });

    // 重做
    bind('.button.redo', () => {
      this.undoManager.redo();
    });

    // 添加卡片
    bind('.button.add', () => {
      this.tableModule.addCard();
    });
  }

  /**
   * 绑定按钮信息提示 — 鼠标悬停在控制按钮上时显示/隐藏功能描述
   */
  bindButtonInfo() {
    document.querySelectorAll('.control .button').forEach((button) => {
      button.addEventListener('mouseover', () => {
        document.querySelectorAll('.context li:not(.static)').forEach((li) => {
          li.style.display = 'none';
        });
        const className = button.className.split(' ')[1];
        const featureToShow = document.querySelector(`.context li.${className}`);
        if (featureToShow) {
          featureToShow.style.display = 'block';
        }
      });

      button.addEventListener('mouseout', () => {
        document.querySelectorAll('.context li:not(.static)').forEach((li) => {
          li.style.display = 'none';
        });
      });
    });
  }

  // ======================== 协调多模块的功能方法 ========================

  /**
   * 清空课程表 — 清除所有 data-drop="copy" 单元格的内容
   */
  empty() {
    const slots = document.querySelectorAll('td[data-drop="copy"]');
    slots.forEach((slot) => {
      slot.innerHTML = '';
    });
  }

  /**
   * 着色 — 移除表格的 colorless 类以显示颜色
   */
  coloring() {
    const table = document.querySelector('.content table.colorless');
    if (table) {
      table.classList.remove('colorless');
    }
  }

  /**
   * 褪色 — 为表格添加 colorless 类以隐藏颜色
   */
  fade() {
    const table = document.querySelector('.content table');
    if (table) {
      table.classList.add('colorless');
    }
  }

  /**
   * 打印 — 使用 html2canvas 将课程表导出为 PNG 图片
   * 包含 html2canvas 可用性检查
   */
  print() {
    if (typeof html2canvas === 'undefined') {
      this.toast.error('打印功能暂不可用，请检查网络连接后刷新页面');
      return;
    }
    const content = document.getElementById('content');
    if (!content) return;

    html2canvas(content, { scrollY: -window.scrollY }).then((canvas) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '课程表.png';
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
  }

  /**
   * 拖拽模式切换 — 复制原始 drag() 逻辑
   * 切换 show-control-icon、disabled、draggable 状态
   */
  drag() {
    // 切换显示控制图标
    const controlableElements = document.querySelectorAll(
      '.controlable, .item, [data-controlable="merge"], [data-controlable="split"]'
    );
    controlableElements.forEach((element) => {
      element.classList.toggle('show-control-icon');
    });

    // 切换 disabled 状态
    document.querySelectorAll('button').forEach((element) => {
      element.disabled = !element.disabled;
    });

    // 切换可拖拽状态
    document.querySelectorAll('.item').forEach((element) => {
      element.draggable = !element.draggable;
    });

    this.editModule.toggleEditable(false);
    this.dragModule.toggleDraggable(true);
  }

  /**
   * 编辑模式切换 — 复制原始 edit() 逻辑
   * 切换 show-control-icon、disabled、draggable 状态
   */
  edit() {
    // 切换显示控制图标
    const controlableElements = document.querySelectorAll(
      '.controlable, .item, [data-controlable="merge"], [data-controlable="split"]'
    );
    controlableElements.forEach((element) => {
      element.classList.toggle('show-control-icon');
    });

    // 切换 disabled 状态
    document.querySelectorAll('button').forEach((element) => {
      element.disabled = !element.disabled;
    });

    // 切换可拖拽状态
    document.querySelectorAll('.item').forEach((element) => {
      element.draggable = !element.draggable;
    });

    this.editModule.toggleEditable(true);
    this.dragModule.toggleDraggable(false);
  }
}
