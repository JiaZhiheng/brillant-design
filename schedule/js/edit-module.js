/**
 * EditModule — 编辑模块
 * 负责内容双击编辑（contentEditable）逻辑
 */
export class EditModule {
  constructor() {
    /** @type {Function} 绑定的事件处理函数引用，用于添加/移除事件监听 */
    this._boundHandler = (event) => this.handleEditableEvent(event);
  }

  /**
   * 切换编辑模式：为所有 .item 和 .editable 元素添加或移除 dblclick 事件监听
   * @param {boolean} enabled - 是否启用编辑
   */
  toggleEditable(enabled) {
    document.querySelectorAll('.item, .editable').forEach((element) => {
      if (enabled) {
        element.addEventListener('dblclick', this._boundHandler);
      } else {
        element.removeEventListener('dblclick', this._boundHandler);
      }
    });
  }

  /**
   * 处理双击编辑事件
   * 将元素设为 contentEditable，选中全部文本，blur 时恢复为不可编辑并清理 innerHTML
   * @param {Event} event
   */
  handleEditableEvent(event) {
    const element = event.target;
    element.contentEditable = 'true';

    // 选中元素内所有文本
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // blur 时恢复为不可编辑，并清理 innerHTML
    element.addEventListener(
      'blur',
      function () {
        element.contentEditable = 'false';
        element.innerHTML = element.textContent.trim()
          ? element.textContent
          : '&nbsp;';
      },
      { once: true }
    );
  }
}
