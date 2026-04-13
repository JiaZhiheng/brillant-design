/**
 * ToastSystem — 非阻塞式消息提示模块
 * 替代 alert 弹窗，支持 success/warning/error/info 四种类型
 */

const TOAST_TYPES = {
  success: { color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' },
  warning: { color: '#faad14', bgColor: '#fffbe6', borderColor: '#ffe58f' },
  error:   { color: '#ff4d4f', bgColor: '#fff2f0', borderColor: '#ffccc7' },
  info:    { color: '#1677ff', bgColor: '#e6f4ff', borderColor: '#91caff' }
};

const ICONS = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ'
};

export class ToastSystem {
  constructor() {
    this.container = null;
  }

  /**
   * 初始化 toast 容器，注入全局样式
   */
  init() {
    // 注入 keyframe 动画样式
    if (!document.getElementById('toast-system-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-system-styles';
      style.textContent = `
        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes toast-fade-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-12px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // 创建 toast 容器
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '10000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'none'
    });
    document.body.appendChild(this.container);
  }

  /**
   * 显示消息提示
   * @param {string} message - 消息文本
   * @param {string} type - 消息类型：success | warning | error | info
   * @param {number} duration - 显示时长（毫秒），默认 3000
   */
  show(message, type = 'info', duration = 3000) {
    if (!this.container) {
      this.init();
    }

    const config = TOAST_TYPES[type] || TOAST_TYPES.info;
    const icon = ICONS[type] || ICONS.info;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    Object.assign(toast.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      lineHeight: '1.5',
      color: config.color,
      backgroundColor: config.bgColor,
      border: `1px solid ${config.borderColor}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      pointerEvents: 'auto',
      animation: 'toast-slide-in 0.3s ease',
      whiteSpace: 'nowrap',
      maxWidth: '400px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    });

    // 图标
    const iconSpan = document.createElement('span');
    iconSpan.style.fontSize = '16px';
    iconSpan.style.flexShrink = '0';
    iconSpan.textContent = icon;

    // 消息文本
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    textSpan.style.overflow = 'hidden';
    textSpan.style.textOverflow = 'ellipsis';

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    this.container.appendChild(toast);

    // 自动消失
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }

    return toast;
  }

  /**
   * 移除单条消息（带淡出动画）
   * @param {HTMLElement} toastElement - 要移除的 toast DOM 元素
   */
  remove(toastElement) {
    if (!toastElement || !toastElement.parentNode) return;

    toastElement.style.animation = 'toast-fade-out 0.3s ease forwards';
    toastElement.addEventListener('animationend', () => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
    }, { once: true });
  }

  /** 快捷方法：成功提示 */
  success(message) {
    return this.show(message, 'success');
  }

  /** 快捷方法：警告提示 */
  warning(message) {
    return this.show(message, 'warning');
  }

  /** 快捷方法：错误提示 */
  error(message) {
    return this.show(message, 'error');
  }

  /** 快捷方法：信息提示 */
  info(message) {
    return this.show(message, 'info');
  }
}
