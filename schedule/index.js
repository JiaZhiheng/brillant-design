let source;
const container = document.querySelector('.container');
const card = document.querySelector('.card');

const initContentHTML = `
<div class="content" id="content">
  <h1 class="editable">课程表</h1>
  <div class="info">
    <div class="editable">班级: ****</div>
    <div class="editable">班主任: ***</div>
  </div>
  <table>
    <colgroup>
      <col>
      <col>
      <col>
      <col>
      <col>
      <col>
      <col>
      <col>
    </colgroup>
    <thead>
      <tr>
        <th class="editable" colspan="2">时间</th>
        <th class="controlable editable">星期一</th>
        <th class="controlable editable">星期二</th>
        <th class="controlable editable">星期三</th>
        <th class="controlable editable">星期四</th>
        <th class="controlable editable">星期五</th>
        <th class="controlable editable">星期六</th>
        <th class="controlable editable">星期日</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="controlable editable" rowspan="6">上午</th>
        <td class="controlable editable">09:00-09:30</td>
        <td class="editable" colspan="7" data-controlable="split">早读</td>
      </tr>
      <tr>
        <td class="controlable editable">09:35-10:20</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">10:30-11:15</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">11:15-11:40</td>
        <td class="editable" colspan="7" data-controlable="split">课间操</td>
      </tr>
      <tr>
        <td class="controlable editable">11:40-12:25</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">12:35-13:20</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <th class="controlable editable" rowspan="1">中午</th>
        <td class="controlable editable">13:20-16:30</td>
        <td class="editable" colspan="7" data-controlable="split">午休</td>
      </tr>
      <tr>
        <th class="controlable editable" rowspan="5">下午</th>
        <td class="controlable editable">16:35-17:20</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">17:30-18:15</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">18:15-18:30</td>
        <td class="editable" colspan="7" data-controlable="split">眼保健操</td>
      </tr>
      <tr>
        <td class="controlable editable">18:30-19:15</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">19:25-20:10</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <th class="controlable editable" rowspan="3">晚上</th>
        <td class="controlable editable">20:10-21:00</td>
        <td class="editable" colspan="7" data-controlable="split">晚饭</td>
      </tr>
      <tr>
        <td class="controlable editable">21:00-21:45</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
      <tr>
        <td class="controlable editable">21:55-22:40</td>
        <td data-drop="copy" data-controlable="merge"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
        <td data-drop="copy"></td>
      </tr>
    </tbody>
  </table>
</div>
`;
const initCardHTML = `
<div class="card" data-drop="move">
  <div data-effect="copy" data-type="major" draggable="true" class="magenta item">语文</div>
  <div data-effect="copy" data-type="major" draggable="true" class="red item">数学</div>
  <div data-effect="copy" data-type="major" draggable="true" class="volcano item">英语</div>
  <div data-effect="copy" data-type="science" draggable="true" class="orange item">物理</div>
  <div data-effect="copy" data-type="science" draggable="true" class="gold item">化学</div>
  <div data-effect="copy" data-type="science" draggable="true" class="lime item">生物</div>
  <div data-effect="copy" data-type="humanities" draggable="true" class="green item">政治</div>
  <div data-effect="copy" data-type="humanities" draggable="true" class="cyan item">历史</div>
  <div data-effect="copy" data-type="humanities" draggable="true" class="blue item">地理</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="geekblue item">音乐</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="purple item">美术</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="success item">体育</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="processing item">科学</div>
  <div data-effect="copy" data-type="patch" draggable="true" class="error item">班会</div>
  <div data-effect="copy" data-type="patch" draggable="true" class="warning item">自习</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="magenta item">综合实践</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="red item">信息技术</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="volcano item">思想品德</div>
  <div data-effect="copy" data-type="minor" draggable="true" class="orange item">心理健康</div>
  <button class="button add" title="add" disabled="" onclick="addCard()"></button>
</div>
`;

// 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  toggleDraggable(true);
  toggleEditable(false);
  markMerge();
  markSplit();
  buttonInfo();
  tableEvent();
  buttonEvent();
});

// 合并标记
function markMerge() {
  document.querySelectorAll('table tbody tr').forEach(tr => {
    const firstCopyCell = tr.querySelector('td[data-drop="copy"]');
    if (firstCopyCell) {
      firstCopyCell.setAttribute('data-controlable', 'merge');
    }
  });
}

// 分解标记
function markSplit() {
  document.querySelectorAll('table tbody tr').forEach(tr => {
    const firstCopyCell = tr.querySelector('[colspan]');
    if (firstCopyCell) {
      firstCopyCell.setAttribute('data-controlable', 'split');
    }
  });
}

// 按钮信息
function buttonInfo() {
  document.querySelectorAll('.control .button').forEach(button => {
    button.addEventListener('mouseover', () => {
      document.querySelectorAll('.context li:not(.static)').forEach(li => {
        li.style.display = 'none';
      });
      const featureToShow = document.querySelector(`.context li.${button.className.split(' ')[1]}`);
      if (featureToShow) {
        featureToShow.style.display = 'block';
      }
    });
    button.addEventListener('mouseout', () => {
      document.querySelectorAll('.context li:not(.static)').forEach(li => {
        li.style.display = 'none';
      });
    });
  });
}

// 表格事件
function tableEvent() {
  // 绑定点击事件到表格的每个列头
  document.querySelectorAll('thead th.controlable').forEach(th => {
    th.addEventListener('click', (event) => {
      cellEvent(event, 'column');
    });
  });

  // 绑定点击事件到表格的每个副行头
  document.querySelectorAll('tbody td.controlable').forEach(td => {
    td.addEventListener('click', (event) => {
      cellEvent(event, 'row');
    });
  });

  // 绑定点击事件到表格的每个主行头
  document.querySelectorAll('tbody th.controlable').forEach(th => {
    th.addEventListener('click', (event) => {
      cellEvent(event, 'th');
    });
  });

  // 绑定双击事件到表格的每个可合并的单元格
  document.querySelectorAll('[data-controlable="merge"]').forEach(td => {
    td.addEventListener('click', (event) => {
      handleCellClick(event, 'bottom-left', merge);
    });
  });

  // 绑定双击事件到表格的每个可分解的单元格
  document.querySelectorAll('[data-controlable="split"]').forEach(td => {
    td.addEventListener('click', (event) => {
      handleCellClick(event, 'bottom-left', split);
    });
  });
}

// 按钮事件
function buttonEvent() {
  // 绑定按钮事件到item的after伪元素
  document.querySelectorAll('.card .item').forEach(function (item) {
    item.addEventListener('click', removeCard);
  });
}

/************************************* 拖拽 **********************************/

// 增加左侧课程列表的容器事件处理
card.ondragover = (e) => {
  e.preventDefault();
};

// 处理拖动元素被放置到左侧课程列表的事件
card.ondrop = (e) => {
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
  if (e.dataTransfer.effectAllowed === 'copy' || e.dataTransfer.effectAllowed === 'move') {
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
        source.addEventListener('dblclick', editableEvent);
      } else if (source.dataset.effect === 'copy') {
        let clone = source.cloneNode(true);
        clone.dataset.effect = 'move';
        clone.draggable = true;
        clone.ondragstart = handleDragStart;
        dropNode.appendChild(clone);
        clone.addEventListener('dblclick', editableEvent);
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

// 切换拖拽事件
function toggleDraggable(type) {
  document.querySelectorAll('.item').forEach(function (element) {
    element.draggable = type;
    type ? element.ondragstart = handleDragStart : element.ondragstart = null;
  });
}

// 拖拽事件
function handleDragStart(e) {
  e.dataTransfer.effectAllowed = e.target.dataset.effect;
  source = e.target;
}

// 切换编辑事件
function toggleEditable(type) {
  document.querySelectorAll('.item, .editable').forEach(function (element) {
    type ? element.addEventListener('dblclick', editableEvent) : element.removeEventListener('dblclick', editableEvent);
  });
}

// 编辑事件
function editableEvent(event) {
  const element = event.target; // 事件关联的元素
  element.contentEditable = 'true';
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
  element.addEventListener('blur', function () {
    element.contentEditable = 'false';
    element.innerHTML = element.textContent.trim() ? element.textContent : '&nbsp;';
  }, { once: true });
}

/************************************* 按钮 **********************************/

// 删除
function removeCard(event) {
  var item = event.currentTarget; // 获取当前点击的th单元格
  var rect = item.getBoundingClientRect();
  var x = event.clientX - rect.left; // 获取点击事件的本地 x 坐标
  var y = event.clientY - rect.top; // 获取本地 y 坐标
  // 假定伪元素的尺寸是 16x16 像素
  var pseudoSize = 16;
  // 检查是否点击在了右上角的伪元素上
  if (x > rect.width - pseudoSize && y < pseudoSize) {
    item.remove();
  }
}

// 添加
function addCard() {
  var card = document.querySelector('.card'); // 获取侧边栏元素
  var newCourse = document.createElement('div'); // 创建一个新的 div 元素作为课程项
  var number = document.querySelectorAll('.item').length; // 获取当前课程项的数量
  newCourse.setAttribute('data-effect', 'copy'); // 设置拖拽效果
  newCourse.setAttribute('draggable', 'false'); // 设置元素可拖拽
  newCourse.classList.add('item', 'show-control-icon'); // 添加 item 类
  newCourse.textContent = '新课程'; // 设置课程项的文字，可以根据需要修改
  // 假设为添加的课程随机分配一个颜色类，请根据实际情况调整
  var colorClasses = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'success', 'processing', 'error', 'warning'];
  var randomColorClass = colorClasses[number % colorClasses.length];
  newCourse.classList.add(randomColorClass);
  newCourse.addEventListener('dblclick', editableEvent)
  newCourse.addEventListener('click', removeCard);

  // 找到.card内的button元素，通常为添加按钮
  var addButton = card.querySelector('button');
  // 在button之前插入新的课程项，如果addButton是null，则appendChild会在末尾添加
  card.insertBefore(newCourse, addButton);
}

// 排课
function arrange() {
  // 获取所有课程卡片的元素
  const cards = Array.from(document.querySelectorAll('.card .item'));

  // 获取所有可分配的单元格
  const slots = document.querySelectorAll('td[data-drop="copy"]');

  // 为每个可分配的单元格随机分配课程卡片
  slots.forEach(slot => {
    // 清空单元格现有内容
    while (slot.firstChild) {
      slot.removeChild(slot.firstChild);
    }

    // 从课程卡片元素列表中随机选择一个并克隆
    const randomIndex = Math.floor(Math.random() * cards.length);
    const clone = cards[randomIndex].cloneNode(true);

    // 移除不需要的拖动相关的事件监听器
    clone.ondragstart = null;

    // 更新克隆元素的数据效果为 "move"
    clone.dataset.effect = 'move';

    // 允许拖动
    clone.draggable = true;

    // 绑定事件监听器
    clone.addEventListener('dblclick', editableEvent);

    // 追加克隆的课程到单元格
    slot.appendChild(clone);
  });

  // 刷新拖拽监听
  toggleDraggable(true);
}

// 清空
function empty() {
  const slots = document.querySelectorAll('td[data-drop="copy"]');
  slots.forEach(slot => slot.innerHTML = '');
}

// 着色
function coloring() {
  const table = document.querySelector('.content table.colorless');
  table?.classList.remove('colorless');
}

// 褪色
function fade() {
  const table = document.querySelector('.content table');
  table.classList.add('colorless');
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

// 拖拽
function drag() {
  // 切换显示控制图标
  var controlableElements = document.querySelectorAll('.controlable, .item, [data-controlable="merge"], [data-controlable="split"]');
  controlableElements.forEach(function (element) {
    element.classList.toggle('show-control-icon');
  });
  // 切换 disabled 状态
  var disabledElements = document.querySelectorAll('button');
  disabledElements.forEach(function (element) {
    element.disabled = !element.disabled;
  });
  // 切换可拖拽状态
  var draggableElements = document.querySelectorAll('.item');
  draggableElements.forEach(function (element) {
    element.draggable = !element.draggable;
  });
  toggleEditable(false);
  toggleDraggable(true);
}

// 编辑
function edit() {
  // 切换显示控制图标
  var controlableElements = document.querySelectorAll('.controlable, .item, [data-controlable="merge"], [data-controlable="split"]');
  controlableElements.forEach(function (element) {
    element.classList.toggle('show-control-icon');
  });
  // 切换 disabled 状态
  var disabledElements = document.querySelectorAll('button');
  disabledElements.forEach(function (element) {
    element.disabled = !element.disabled;
  });
  // 切换可拖拽状态
  var draggableElements = document.querySelectorAll('.item');
  draggableElements.forEach(function (element) {
    element.draggable = !element.draggable;
  });
  toggleEditable(true);
  toggleDraggable(false);
}

// 存档
function archive() {
  const contentElement = document.querySelector('.content');
  const cardElement = document.querySelector('.card');

  if (contentElement) {
    const contentHTML = contentElement.outerHTML;
    localStorage.setItem('contentHTML', contentHTML);
  }

  if (cardElement) {
    const cardHTML = cardElement.outerHTML;
    localStorage.setItem('cardHTML', cardHTML);
  }
  alert('数据已保存到 localStorage');
}

// 读档
function load() {
  const contentHTML = localStorage.getItem('contentHTML');
  const cardHTML = localStorage.getItem('cardHTML');
  let contentLoaded = false;
  let cardLoaded = false;

  if (contentHTML) {
    const contentElement = document.querySelector('.content');
    if (contentElement) {
      contentElement.outerHTML = contentHTML;
      contentLoaded = true; // 标记content元素已加载
    } else {
      console.warn('页面上未找到类名为 "content" 的元素。');
    }
  }

  if (cardHTML) {
    const cardElement = document.querySelector('.card');
    if (cardElement) {
      cardElement.outerHTML = cardHTML;
      cardLoaded = true; // 标记card元素已加载
    } else {
      console.warn('页面上未找到类名为 "card" 的元素。');
    }
  }

  // 检查两个元素是否都已成功加载
  if (contentLoaded && cardLoaded) {
    alert('数据已从 localStorage 加载成功');
    toggleDraggable(true);
    toggleEditable(false);
  }
}

// 初始化
function init() {
  const contentHTML = initContentHTML;
  const cardHTML = initCardHTML;
  let contentLoaded = false;
  let cardLoaded = false;

  if (contentHTML) {
    const contentElement = document.querySelector('.content');
    if (contentElement) {
      contentElement.outerHTML = contentHTML;
      contentLoaded = true; // 标记content元素已加载
    } else {
      console.warn('页面上未找到类名为 "content" 的元素。');
    }
  }

  if (cardHTML) {
    const cardElement = document.querySelector('.card');
    if (cardElement) {
      cardElement.outerHTML = cardHTML;
      cardLoaded = true; // 标记card元素已加载
    } else {
      console.warn('页面上未找到类名为 "card" 的元素。');
    }
  }

  // 清空 localStorage
  localStorage.removeItem('contentHTML');
  localStorage.removeItem('cardHTML');

  // 检查两个元素是否都已成功加载
  if (contentLoaded && cardLoaded) {
    alert('项目初始化成功');
    toggleDraggable(true);
    toggleEditable(false);
  }
}

/************************************* 表格 **********************************/

// 单元格点击事件
function cellEvent(event, type) {
  var cell = event.currentTarget; // 获取当前点击的th单元格
  var cellIndex
  if (type === 'column') {
    cellIndex = cell.cellIndex;
  } else if (type === 'row') {
    cellIndex = cell.parentNode.sectionRowIndex;
  }

  var rect = cell.getBoundingClientRect();
  var x = event.clientX - rect.left; // 获取点击事件的本地 x 坐标
  var y = event.clientY - rect.top; // 获取本地 y 坐标
  var pseudoSize = 16;

  // 添加
  if (x > rect.width - pseudoSize && y < pseudoSize) {
    if (type === 'column') {
      closeColumn(cellIndex);
    } else if (type === 'row') {
      closeRow(cellIndex);
    } else if (type === 'th') {
      closeTh(cell);
    }
  }

  // 删除
  if (x > rect.width - pseudoSize && y > rect.height - pseudoSize) {
    if (type === 'column') {
      addColumn(cellIndex);
    } else if (type === 'row') {
      addRow(cellIndex);
    } else if (type === 'th') {
      addTh(cell);
    }
  }
}

// 添加列
function addColumn(index) {
  var table = document.querySelector('table');
  Array.from(table.rows).forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      let th = document.createElement('th');
      th.className = 'controlable editable show-control-icon';
      th.textContent = '星期几';
      th.addEventListener('dblclick', editableEvent);
      th.addEventListener('click', (event) => { cellEvent(event, 'column')});
      row.insertBefore(th, row.cells[index + 1] || null);
    } else {
      if (row.cells[row.cells.length - 1].hasAttribute('colspan')) {
        let lastCell = row.cells[row.cells.length - 1];
        let colspanValue = parseInt(lastCell.getAttribute('colspan'), 10);
        lastCell.setAttribute('colspan', colspanValue + 1);
      } else {
        row.insertBefore(createCell(), row.cells[0].hasAttribute('rowspan') ? row.cells[index + 2] : row.cells[index + 1] || null);
      }
    }
  });
}

// 删除列
function closeColumn(index) {
  var table = document.querySelector('table');
  Array.from(table.rows).forEach((row, rowIndex) => {
    if (index === 1) {
      if (row.cells[row.cells.length - 1].hasAttribute('colspan')) {
        let colspan = parseInt(row.cells[row.cells.length - 1].getAttribute('colspan'), 10);
        if (colspan > 1) {
          // 减少colspan值
          row.cells[row.cells.length - 1].setAttribute('colspan', colspan - 1);
        } else {
          // 如果colspan为1，则删除整行
          row.remove();
        }
      } else {
        if (row.cells[0].hasAttribute('rowspan')) {
          row.cells[index + 2].setAttribute('data-controlable', 'merge');
          row.cells[index + 2].classList.add('show-control-icon');
          row.cells[index + 2].addEventListener('click', (event) => {
            handleCellClick(event, 'bottom-left', merge);
          });
          row.deleteCell(index + 1);
        } else {
          if (rowIndex === 0) {
            row.deleteCell(index);
          } else {
            row.cells[index + 1].setAttribute('data-controlable', 'merge');
            row.cells[index + 1].classList.add('show-control-icon');
            row.cells[index + 1].addEventListener('click', (event) => {
              handleCellClick(event, 'bottom-left', merge);
            });
            row.deleteCell(index);
          }
        }
      }
    } else {
      if (row.cells[row.cells.length - 1].hasAttribute('colspan')) {
        let colspan = parseInt(row.cells[row.cells.length - 1].getAttribute('colspan'), 10);
        if (colspan > 1) {
          // 减少colspan值
          row.cells[row.cells.length - 1].setAttribute('colspan', colspan - 1);
        } else {
          // 如果colspan为1，则删除整行
          row.remove();
        }
      } else {
        row.deleteCell(index);
      }
    }
  });
}

// 添加副行
function addRow(index) {
  var table = document.querySelector('table');
  Array.from(table.rows).forEach((row, rowIndex) => {
    if (rowIndex === index + 1) {
      if (row.cells[0].getAttribute('rowspan')) {
        row.cells[0].setAttribute('rowspan', parseInt(row.cells[0].getAttribute('rowspan'), 10) + 1);
      } else {
        let prevRowspanIndex = index;
        while (prevRowspanIndex >= 0 && !table.rows[prevRowspanIndex].cells[0].hasAttribute('rowspan')) {
          prevRowspanIndex--;
        }
        let prevRowspan = table.rows[prevRowspanIndex].cells[0];
        let rowspan = parseInt(prevRowspan.getAttribute('rowspan'), 10);
        prevRowspan.setAttribute('rowspan', rowspan + 1);
      }
      row.parentNode.insertBefore(createDeputyTr(), row.nextElementSibling);
    }
  });
}

// 删除副行
function closeRow(index) {
  var table = document.querySelector('table');
  Array.from(table.rows).forEach((row, rowIndex) => {
    if (rowIndex === index + 1) {
      var rowspan
      if (row.cells[0].getAttribute('rowspan')) {
        // 如果带有rowspan属性
        // 复制该行的第一个单元格并将rowspan值减1，然后将复制的单元格插入到下一个兄弟元素的第一个子元素之前
        // 如果rowspan值为1，则删除该单元格
        rowspan = parseInt(row.cells[0].getAttribute('rowspan'), 10);
        if (rowspan > 1) {
          row.cells[0].setAttribute('rowspan', rowspan - 1);
          let newTh = row.cells[0].cloneNode(true);
          newTh.className = 'controlable editable show-control-icon';
          newTh.setAttribute('contenteditable', 'true');
          newTh.setAttribute('rowspan', rowspan - 1);
          newTh.addEventListener('click', (event) => { cellEvent(event, 'th') });
          row.nextElementSibling.insertBefore(newTh, row.nextElementSibling.cells[0]);
          row.remove();
        } else {
          row.remove();
        }
      } else {
        // 找到rows中距离index最近的上一个带有rowspan属性的单元格并将它的rowspan值减1
        let prevRowspanIndex = index;
        while (prevRowspanIndex >= 0 && !table.rows[prevRowspanIndex].cells[0].hasAttribute('rowspan')) {
          prevRowspanIndex--;
        }
        let prevRowspan = table.rows[prevRowspanIndex].cells[0];
        rowspan = parseInt(prevRowspan.getAttribute('rowspan'), 10);
        prevRowspan.setAttribute('rowspan', rowspan - 1);
        row.remove();
      }
    }
  });
}

// 添加主行
function addTh(th) {
  var table = document.querySelector('table');
  var rowspan = th.getAttribute('rowspan');
  var rowIndex = th.parentNode.sectionRowIndex;
  table.rows[rowIndex + Number(rowspan)].after(createMainTr());
}

// 删除主行
function closeTh(th) {
  // 从th所在行开始，th 的 rowspan 属性为几就删除几行
  var table = document.querySelector('table');
  var rowIndex = th.parentNode.sectionRowIndex;
  var rowspan = th.getAttribute('rowspan');
  for (let i = 0; i < rowspan; i++) {
    table.rows[rowIndex + 1].remove();
  }
}

// 创建单元格
function createCell(control = false) {
  let cell = document.createElement('td');
  cell.setAttribute('data-drop', 'copy');
  if (control) {
    cell.setAttribute('data-controlable', 'merge');
    cell.classList.add('show-control-icon');
    cell.addEventListener('click', (event) => {
      handleCellClick(event, 'bottom-left', merge);
    });
  }
  return cell;
}

// 创建长单元格
function createLongCell(control = false) {
  var table = document.querySelector('table');
  var row = table.rows[0];
  var length = row.cells.length;
  let cell = document.createElement('td');
  cell.classList.add('editable');
  cell.setAttribute('colspan', length - 1);
  if (control) {
    cell.setAttribute('data-controlable', 'split');
    cell.classList.add('show-control-icon');
    cell.addEventListener('click', (event) => {
      handleCellClick(event, 'bottom-left', split);
    });
    cell.addEventListener('dblclick', editableEvent);
  }
  return cell;
}

// 创建时间格
function createTimeCell() {
  let cell = document.createElement('td');
  cell.className = 'controlable editable show-control-icon';
  cell.textContent = '00:00-00:00';
  cell.addEventListener('click', (event) => { cellEvent(event, 'row') });
  cell.addEventListener('dblclick', editableEvent);
  return cell;
}

// 创建时段格
function createPeriodCell() {
  let cell = document.createElement('th');
  cell.className = 'controlable editable show-control-icon';
  cell.setAttribute('rowspan', 1);
  cell.addEventListener('click', (event) => { cellEvent(event, 'th') });
  cell.addEventListener('dblclick', editableEvent);
  return cell;
}

// 创建主行
function createMainTr() {
  let table = document.querySelector('table');
  let tr = document.createElement('tr');
  for (let i = 0; i < table.rows[0].cells.length + 1; i++) {
    if (i === 0) {
      tr.appendChild(createPeriodCell());
    } else if (i === 1) {
      tr.appendChild(createTimeCell());
    } else if (i === 2) {
      tr.appendChild(createCell(true));
    } else {
      tr.appendChild(createCell(false));
    }
  }
  return tr;
}

// 创建副行
function createDeputyTr() {
  let table = document.querySelector('table');
  let tr = document.createElement('tr');
  for (let i = 0; i < table.rows[0].cells.length; i++) {
    if (i === 0) {
      tr.appendChild(createTimeCell());
    } else if (i === 1) {
      tr.appendChild(createCell(true));
    } else {
      tr.appendChild(createCell(false));
    }
  }
  return tr;
}

// 合并单元格
function merge(event) {
  var cell = event.currentTarget; // 获取当前点击的th单元格
  var index = cell.parentNode.sectionRowIndex;
  var table = document.querySelector('table');
  Array.from(table.rows).forEach((row, rowIndex) => {
    if (rowIndex === index + 1) {
      let cells = Array.from(row.cells);
      cells.forEach((cell, cellIndex) => {
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
      let longCell = createLongCell(true);
      row.appendChild(longCell);
    }
  });
}

// 分解单元格
function split(event) {
  var cell = event.currentTarget; // 获取当前点击的th单元格
  var index = cell.parentNode.sectionRowIndex;
  var table = document.querySelector('table');
  Array.from(table.rows).forEach((row, rowIndex) => {
    if (rowIndex === index + 1) {
      // 获取本行最后一个单元格的 colspan 值、并删除最后一个单元格
      let lastCell = row.cells[row.cells.length - 1];
      let colspanValue = parseInt(lastCell.getAttribute('colspan'), 10);
      row.deleteCell(-1);
      // 重新创建单元格, colspanValue 值为多少就创建多少个单元格
      for (let i = 0; i < colspanValue; i++) {
        if (i === 0) {
          row.appendChild(createCell(true));
        } else {
          row.appendChild(createCell(false));
        }
      }
    }
  });
}

// 单元格点击事件
function handleCellClick(event, position, triggerEvent) {
  var item = event.currentTarget;
  var rect = item.getBoundingClientRect();
  var pseudoSize = 16;
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var isInTargetPosition = false;
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


