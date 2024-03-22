let source;
const container = document.querySelector('.container');
const sidebar = document.querySelector('.sidebar');
document.querySelectorAll('.item').forEach(makeDraggable);
document.querySelectorAll('.item').forEach(makeDraggableAndEditable);

// 增加左侧课程列表的容器事件处理
sidebar.ondragover = (e) => {
  e.preventDefault();
};

// 允许拖动并放置到左侧课程列表中
sidebar.ondragover = (e) => {
  e.preventDefault();
};

// 处理拖动元素被放置到左侧课程列表的事件
sidebar.ondrop = (e) => {
  e.preventDefault();
  if (source.dataset.effect === 'move') {
    source.parentNode.removeChild(source);
  }
};

// 处理拖动开始时在容器上触发的事件
container.ondragstart = (e) => {
  handleDragStart(e);
};

// 允许拖动经过，以便可以在目标上放置
container.ondragover = (e) => {
  e.preventDefault();
};

// 当拖动的元素进入目标时添加高亮样式
container.ondragenter = (e) => {
  clearDropStyle();
  const dropNode = getDropNode(e.target);
  if (!dropNode) {
    return;
  }
  if (e.dataTransfer.effectAllowed === dropNode.dataset.drop) {
    dropNode.classList.add('drop-over');
  }
};

// 处理放置动作，更新目标单元格，并提供复制和移动逻辑
container.ondrop = (e) => {
  e.preventDefault(); 
  clearDropStyle();
  const dropNode = getDropNode(e.target);
  if (!dropNode) {
    return;
  }
  if (dropNode !== source && dropNode.dataset.drop === 'copy') {
    if (dropNode.tagName === 'TD') {
      while (dropNode.firstChild) {
        dropNode.removeChild(dropNode.firstChild);
      }
      if (source.dataset.effect === 'move') {
        dropNode.appendChild(source);
         toggleEditable(source);
      } else if (source.dataset.effect === 'copy') { 
        let clone = source.cloneNode(true);
        clone.dataset.effect = 'move';
        makeDraggable(clone); 
        dropNode.appendChild(clone);
        toggleEditable(clone);
      }
    }
  }
};

// 清除所有具有 'drop-over' 类的节点的样式
function clearDropStyle() {
  const dropNodes = document.querySelectorAll('.drop-over');
  dropNodes.forEach((node) => {
    node.classList.remove('drop-over');
  });
}

// 根据传入的节点向上寻找具有 data-drop 属性的节点
function getDropNode(node) {
  while (node) {
    if (node.dataset?.drop) {
      return node;
    }
    node = node.parentNode;
  }
}

// 处理拖动开始时的事件，设置拖动效果和存储源元素
function handleDragStart(e) {
  e.dataTransfer.effectAllowed = e.target.dataset.effect;
  source = e.target;
}

// 使元素可拖动，并在拖动开始时处理事件
function makeDraggable(element) {
  element.draggable = true;
  element.ondragstart = handleDragStart;
}

// 函数用于在双击时切换元素的可编辑状态
function toggleEditable(element) {
  element.addEventListener('dblclick', function() {
    this.contentEditable = true;
    const range = document.createRange();
    range.selectNodeContents(this);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.addEventListener('blur', function() {
      this.contentEditable = false;
      this.innerHTML = this.textContent.trim() ? this.textContent : '&nbsp;';
    }, { once: true });
  });
}

// 为元素配置拖动并使其可双击编辑
function makeDraggableAndEditable(element) {
  makeDraggable(element);
  toggleEditable(element);
}

// 打印
function print() {
  var content = document.getElementById('content');
  html2canvas(content, { scrollY: -window.scrollY }).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '课程表.png';
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  });
}

// 重置
function reset() {
  const slots = document.querySelectorAll('td[data-drop="copy"]');
  slots.forEach(slot => slot.innerHTML = '');
}


