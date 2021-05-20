/* eslint-disable */
import { Chart } from '@antv/g2';

export function columnLineRender(chartData, container, height = 300) {
  // 移除所有子节点
  while (container && container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // 判断 chartData 是否为空
  if (chartData.length === 0) {
    return;
  }
  const data = [];
  chartData.forEach(item => {
    const { customer_id, customer_name, total, ...rest } = item;

    Object.keys(rest).forEach(label => {
      const opts = {};
      opts.customer_name = customer_name + '';
      opts.type = label;
      opts.value = +rest[label] || 0;
      data.push(opts);
    })
  })

  const chart = new Chart({
    container,
    forceFit: true,
    height,
    padding: 'auto'
  });
  chart.source(data);
  chart.scale('value', {
    alias: '总量',
  });
  chart.axis('customer_name', {
    label: {
      textStyle: {
        fill: '#aaaaaa',
      }
    },
    tickLine: {
      alignWithLabel: false,
      length: 0
    }
  });

  chart.axis('value', {
    label: {
      textStyle: {
        fill: '#aaaaaa',
      },
    },
    title: {
      offset: 80
    }
  });
  chart.legend({
    position: 'right-center',
  });
  chart.intervalStack()
    .position('customer_name*value')
    .color('type', ['#A5A5A5', '#5B9BD5', '#FFC000', '#FF7F4F', '#1989FA'])
    .opacity(1)
    .label('value', val => {
      if (val < 10) {
        return false;
      }
      return {
        position: 'middle',
        offset: 0,
        textStyle: {
          fill: '#fff',
          fontSize: 12,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)',
        },
        formatter: text => {
          return text;
        }
      };
    });
  chart.render();
}
