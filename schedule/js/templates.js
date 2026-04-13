/**
 * templates.js — HTML 模板常量模块
 * 
 * 包含课程表初始化所需的 HTML 模板：
 * - initContentHTML: 课程表主体内容模板
 * - initCardHTML: 右侧课程卡片面板模板
 */

export const initContentHTML = `
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

export const initCardHTML = `
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
