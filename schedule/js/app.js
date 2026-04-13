/**
 * app.js — 主入口模块
 * 负责初始化所有模块并协调模块间通信
 *
 * 需求: 6.7, 10.6
 */

import { EventManager } from './event-manager.js';
import { DragModule } from './drag-module.js';
import { EditModule } from './edit-module.js';
import { TableModule } from './table-module.js';
import { ArrangeEngine } from './arrange-engine.js';
import { StateManager } from './state-manager.js';
import { UndoManager } from './undo-manager.js';
import { ToastSystem } from './toast-system.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 创建 ToastSystem 并初始化
  const toast = new ToastSystem();
  toast.init();

  // 2. 创建基础模块（无依赖或仅依赖简单模块）
  const dragModule = new DragModule();
  const editModule = new EditModule();
  const tableModule = new TableModule(editModule);
  const arrangeEngine = new ArrangeEngine(toast, dragModule);

  // 3. 创建 EventManager（先传 null 给 stateManager/undoManager，后续补充）
  //    处理循环依赖：StateManager.onRestore 需要 eventManager.rebindAll()
  const eventManager = new EventManager({
    dragModule,
    editModule,
    tableModule,
    arrangeEngine,
    stateManager: null,
    undoManager: null,
    toast
  });

  // 4. 创建 StateManager，onRestore 回调引用 eventManager.rebindAll
  const stateManager = new StateManager(toast, () => eventManager.rebindAll());

  // 5. 创建 UndoManager
  const undoManager = new UndoManager(stateManager);

  // 6. 补充 EventManager 的 stateManager 和 undoManager 引用
  eventManager.stateManager = stateManager;
  eventManager.undoManager = undoManager;

  // 7. 在控制面板中添加撤销和重做按钮
  addUndoRedoButtons();

  // 8. 绑定所有事件
  eventManager.bindAll();

  // 9. 初始化拖拽和编辑状态
  dragModule.toggleDraggable(true);
  editModule.toggleEditable(false);

  // 10. 标记合并/拆分单元格
  tableModule.markMerge();
  tableModule.markSplit();
});

/**
 * 在控制面板 .control 中添加撤销和重做按钮，
 * 并在 .context 中添加对应的功能描述
 */
function addUndoRedoButtons() {
  const controlDiv = document.querySelector('.control');
  if (controlDiv) {
    // 创建撤销按钮
    const undoBtn = document.createElement('button');
    undoBtn.className = 'button undo';
    undoBtn.textContent = '撤销';

    // 创建重做按钮
    const redoBtn = document.createElement('button');
    redoBtn.className = 'button redo';
    redoBtn.textContent = '重做';

    controlDiv.appendChild(undoBtn);
    controlDiv.appendChild(redoBtn);
  }

  // 在 .context 中添加对应的功能描述
  const contextUl = document.querySelector('.context');
  if (contextUl) {
    const undoLi = document.createElement('li');
    undoLi.className = 'undo';
    undoLi.textContent = '撤销: 撤销上一步操作，恢复到之前的状态。快捷键 Ctrl+Z（Mac 为 Cmd+Z）。';

    const redoLi = document.createElement('li');
    redoLi.className = 'redo';
    redoLi.textContent = '重做: 重做已撤销的操作，恢复到撤销前的状态。快捷键 Ctrl+Y（Mac 为 Cmd+Shift+Z）。';

    contextUl.appendChild(undoLi);
    contextUl.appendChild(redoLi);
  }
}
