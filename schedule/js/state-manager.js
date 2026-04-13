/**
 * StateManager — 状态管理模块
 * 负责存档/读档/初始化操作，使用 innerHTML 替换（非 outerHTML）修复 DOM 引用失效 Bug
 * 提供 getSnapshot / restoreSnapshot 方法用于撤销/重做
 *
 * 需求: 1.1, 1.2, 7.3, 9.3, 9.4, 9.5, 9.6
 */

import { initContentHTML, initCardHTML } from './templates.js';

export class StateManager {
  /**
   * @param {import('./toast-system.js').ToastSystem} toast - ToastSystem 实例
   * @param {Function} onRestore - DOM 替换后的回调函数，用于重新绑定事件
   */
  constructor(toast, onRestore) {
    this.toast = toast;
    this.onRestore = onRestore;
  }

  /**
   * 存档 — 将 .content innerHTML 和 .card innerHTML 保存到 localStorage
   */
  archive() {
    try {
      const contentElement = document.querySelector('.content');
      const cardElement = document.querySelector('.card');

      if (!contentElement || !cardElement) {
        this.toast.error('存档失败：未找到课程表或卡片面板元素');
        return;
      }

      localStorage.setItem('contentHTML', contentElement.innerHTML);
      localStorage.setItem('cardHTML', cardElement.innerHTML);
      this.toast.success('数据已成功保存');
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        this.toast.error('存档失败：存储空间不足');
      } else {
        this.toast.error('存档失败：' + e.message);
      }
    }
  }

  /**
   * 读档 — 从 localStorage 读取数据并恢复
   * 使用 innerHTML 替换（非 outerHTML）以保持容器 DOM 引用不变
   */
  load() {
    try {
      const contentHTML = localStorage.getItem('contentHTML');
      const cardHTML = localStorage.getItem('cardHTML');

      if (!contentHTML || !cardHTML) {
        this.toast.error('读档失败：未找到存档数据');
        return;
      }

      if (!this.validateData(contentHTML, cardHTML)) {
        this.toast.error('读档失败：存储数据已损坏');
        return;
      }

      const contentElement = document.querySelector('.content');
      const cardElement = document.querySelector('.card');

      if (!contentElement || !cardElement) {
        this.toast.error('读档失败：未找到课程表或卡片面板元素');
        return;
      }

      // 使用 innerHTML 替换，保持容器引用不变
      contentElement.innerHTML = contentHTML;
      cardElement.innerHTML = cardHTML;

      // DOM 替换后调用回调重新绑定事件
      if (typeof this.onRestore === 'function') {
        this.onRestore();
      }

      this.toast.success('数据已成功加载');
    } catch (e) {
      this.toast.error('读档失败：' + e.message);
    }
  }

  /**
   * 初始化 — 重置为默认状态
   * 使用 innerHTML 替换，从模板中提取内部内容
   */
  init() {
    const contentElement = document.querySelector('.content');
    const cardElement = document.querySelector('.card');

    if (!contentElement || !cardElement) {
      this.toast.error('初始化失败：未找到课程表或卡片面板元素');
      return;
    }

    // 模板是 outerHTML（包含外层 div），需要解析提取 innerHTML
    const tempContent = document.createElement('div');
    tempContent.innerHTML = initContentHTML;
    const newContentNode = tempContent.firstElementChild;

    const tempCard = document.createElement('div');
    tempCard.innerHTML = initCardHTML;
    const newCardNode = tempCard.firstElementChild;

    // 使用 innerHTML 替换，保持容器引用不变
    contentElement.innerHTML = newContentNode.innerHTML;
    cardElement.innerHTML = newCardNode.innerHTML;

    // 同步属性（确保 id、class 等与模板一致）
    this._syncAttributes(contentElement, newContentNode);
    this._syncAttributes(cardElement, newCardNode);

    // 清空 localStorage
    localStorage.removeItem('contentHTML');
    localStorage.removeItem('cardHTML');

    // DOM 替换后调用回调重新绑定事件
    if (typeof this.onRestore === 'function') {
      this.onRestore();
    }

    this.toast.success('项目初始化成功');
  }

  /**
   * 验证数据格式
   * @param {*} contentHTML - 内容区 HTML 字符串
   * @param {*} cardHTML - 卡片区 HTML 字符串
   * @returns {boolean} 数据是否有效
   */
  validateData(contentHTML, cardHTML) {
    try {
      if (typeof contentHTML !== 'string' || typeof cardHTML !== 'string') {
        return false;
      }
      if (!contentHTML.trim() || !cardHTML.trim()) {
        return false;
      }
      if (!contentHTML.includes('<table')) {
        return false;
      }
      if (!cardHTML.includes('data-drop="move"')) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 获取当前状态快照（用于撤销/重做）
   * @returns {{ contentHTML: string, cardHTML: string }}
   */
  getSnapshot() {
    const contentElement = document.querySelector('.content');
    const cardElement = document.querySelector('.card');
    return {
      contentHTML: contentElement ? contentElement.innerHTML : '',
      cardHTML: cardElement ? cardElement.innerHTML : ''
    };
  }

  /**
   * 从快照恢复状态（用于撤销/重做）
   * @param {{ contentHTML: string, cardHTML: string }} snapshot
   */
  restoreSnapshot(snapshot) {
    const contentElement = document.querySelector('.content');
    const cardElement = document.querySelector('.card');

    if (!contentElement || !cardElement) {
      return;
    }

    // 使用 innerHTML 替换，保持容器引用不变
    contentElement.innerHTML = snapshot.contentHTML;
    cardElement.innerHTML = snapshot.cardHTML;

    // DOM 替换后调用回调重新绑定事件
    if (typeof this.onRestore === 'function') {
      this.onRestore();
    }
  }

  /**
   * 同步源元素的属性到目标元素
   * @param {HTMLElement} target - 目标元素
   * @param {HTMLElement} source - 源元素
   * @private
   */
  _syncAttributes(target, source) {
    // 复制源元素的所有属性到目标元素
    Array.from(source.attributes).forEach(attr => {
      target.setAttribute(attr.name, attr.value);
    });
  }
}
