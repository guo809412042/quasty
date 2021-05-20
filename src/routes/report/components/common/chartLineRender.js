/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-12-10 10:55:18
 * @LastEditTime: 2020-07-23 13:47:26
 * @LastEditors: ssssslf
 */
import { Chart } from '@antv/g2';

export function chartLineRender(data, node, height = 300, unit = '', colors = []) {
  // 移除所有子节点
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
  // 判断 data 是否为空
  if (data.length === 0) {
    return;
  }
  // 图表样式配置
  const chart = new Chart({
    container: node,
    forceFit: true,
    height,
    padding: 'auto',
  });
  chart.legend({
    position: 'top',
    itemWrap: true,
  });
  // 图表数据配置
  chart.source(data);
  chart.scale('day', {
    alias: '日期',
  });
  chart.scale('value', { alias: '数值', formatter: val => `${val} ${unit}` });
  chart.scale('type', { alias: '类型' });
  let line;
  if (colors.length) {
    line = chart
      .line()
      .position('day*value')
      .size(2)
      .color('type', colors);
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .color('type', colors);
  } else {
    line = chart
      .line()
      .position('day*value')
      .size(2)
      .color('type');
    chart
      .point()
      .position('day*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      })
      .color('type');
  }

  chart.render();
  return line;
}
