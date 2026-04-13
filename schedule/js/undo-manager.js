/**
 * UndoManager — 撤销/重做模块
 * 管理操作历史栈，支持撤销（undo）和重做（redo）
 *
 * 需求: 10.1, 10.2, 10.3, 10.4, 10.5
 */

export class UndoManager {
  /**
   * @param {import('./state-manager.js').StateManager} stateManager - StateManager 实例
   */
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;
  }

  /**
   * 保存当前状态快照到撤销栈
   * 新操作会清空重做栈（重做历史失效）
   * 超出 maxHistory 时丢弃最早的记录
   */
  saveSnapshot() {
    const snapshot = this.stateManager.getSnapshot();
    this.undoStack.push(snapshot);

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }

    this.redoStack = [];
  }

  /**
   * 撤销 — 恢复到上一个状态
   * 将当前状态压入重做栈，从撤销栈弹出并恢复
   */
  undo() {
    if (this.undoStack.length === 0) {
      return;
    }

    const currentSnapshot = this.stateManager.getSnapshot();
    this.redoStack.push(currentSnapshot);

    const previousSnapshot = this.undoStack.pop();
    this.stateManager.restoreSnapshot(previousSnapshot);
  }

  /**
   * 重做 — 恢复到重做栈中的下一个状态
   * 将当前状态压入撤销栈，从重做栈弹出并恢复
   */
  redo() {
    if (this.redoStack.length === 0) {
      return;
    }

    const currentSnapshot = this.stateManager.getSnapshot();
    this.undoStack.push(currentSnapshot);

    const nextSnapshot = this.redoStack.pop();
    this.stateManager.restoreSnapshot(nextSnapshot);
  }

  /**
   * 清空重做栈
   */
  clearRedoStack() {
    this.redoStack = [];
  }

  /**
   * 检查是否可以撤销
   * @returns {boolean}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * 检查是否可以重做
   * @returns {boolean}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
}
