<template>
  <div style="height: 320px">
    <div v-if="stats.length > 0" class="flex container">
      <div v-for="(stat, idx) in stats" :key="idx" class="stat-block">
        <div class="value">{{ stat.value }}</div>
        <div class="description">{{ stat.title }}</div>
        <div></div>
      </div>
    </div>
    <LineChart
      ref="doughnutRef"
      @chart:render="handleChartRender"
      @chart:update="handleChartRender"
      class="chart"
      :chartData="finalData"
      :options="options"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
export default {
  name: 'BaseLineChart',
  components: {
    LineChart,
  },
  props: {
    data: {
      type: Array,
      default: [
        {
          label: 'ART',
          borderColor: '#AAA7CC',
          data: [65, 59, 80, 81, 56, 55, 40],
          pointStyle: 'circle',
          pointRadius: 1,
        },
        {
          label: 'DEX',

          borderColor: '#84B81D',
          data: [22, 33, 44, 55, 66, 77, 88],
          pointStyle: 'circle',
          pointRadius: 1,
        },
        {
          label: 'NAME',

          borderColor: '#25B8AE',
          data: [10, 16, 5, 30, 5, 9, 56],
          pointStyle: 'circle',
          pointRadius: 1,
        },
      ],
    },
    labels: {
      type: Array,
      default: [1, 2, 3, 4, 5, 6, 7],
    },
    stats: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    const doughnutRef = ref();

    const handleChartRender = (ref) => {
      let data = ref._metasets.map((i) => {
        return {
          value: +i._dataset.data[i.data.length - 1],
          color: i._dataset.borderColor,
          position: i.data[i.data.length - 1] ? i.data[i.data.length - 1].y : 0,
        };
      });
      let tooltipEl = ref.canvas.parentNode.querySelector('div');
      const boxes = ref.canvas.parentNode.querySelectorAll('div');
      boxes.forEach((box) => {
        box.remove();
      });
      for (let el of data) {
        tooltipEl = document.createElement('div');
        tooltipEl.classList.add('chart-tooltip');
        tooltipEl.style.background = changeBrightness(el.color);
        tooltipEl.style.top = el.position + 'px';
        tooltipEl.innerHTML += el.value;
        ref.canvas.parentElement.appendChild(tooltipEl);
      }
    };
    const getOrCreateTooltip = (chart) => {
      let tooltipEl = chart.canvas.parentNode.querySelector('span');

      if (!tooltipEl) {
        tooltipEl = document.createElement('span');
        tooltipEl.classList.add('info-tooltip');
        const table = document.createElement('table');
        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
      }

      return tooltipEl;
    };
    const changeBrightness = (color) => {
      const num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * 15),
        R = (num >> 16) + amt,
        G = ((num >> 8) & 0x00ff) + amt,
        B = (num & 0x0000ff) + amt;
      return (
        '#' +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    };
    const externalTooltipHandler = (context) => {
      // Tooltip Element
      const { chart, tooltip } = context;
      const tooltipEl = getOrCreateTooltip(chart);

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      // Set Text
      if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map((b) => b.lines);

        const tableBody = document.createElement('tbody');
        bodyLines.forEach((body, i) => {
          const tr = document.createElement('tr');
          tr.style.backgroundColor = 'inherit';
          tr.style.borderWidth = 0;

          const td = document.createElement('td');
          td.style.borderWidth = 0;

          const text = document.createTextNode(body);

          td.appendChild(text);
          tr.appendChild(td);
          tableBody.appendChild(tr);
        });

        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
          tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableBody);
      }

      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = positionX + tooltip.caretX + 'px';
      tooltipEl.style.top = positionY + tooltip.caretY + 'px';
      tooltipEl.style.font = tooltip.options.bodyFont.string;
      tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    };
    const finalData = {
      labels: props.labels,
      datasets: props.data,
    };
    const options = {
      responsive: true,
      animation: {
        onProgress: function (animation) {
          handleChartRender(doughnutRef.value.chartInstance);
        },
        onComplete: function (animation) {
          //handleChartRender(animation);
        },
      },
      scales: {
        y: {
          position: 'right',
          stackWeight: 1,
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              family: 'Basis Grotesque Pro',
            },
            color: '#6A6D8F',
          },
        },
        x: {
          ticks: {
            font: {
              size: 12,
              family: 'Basis Grotesque Pro',
            },
            color: '#6A6D8F',
          },

          grid: {
            color: '#DAD9F7',
            borderColor: '#DAD9F7',
            fontSize: 40,
            borderDash: [5, 5],
            borderDashOffset: 2,
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: false,
          external: externalTooltipHandler,
        },
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    };

    return { finalData, options, handleChartRender, doughnutRef };
  },
};
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  padding: 16px;
  .stat-block {
    padding: 8px 16px;
    border: 1px solid $default-border;
    background: $white;
    z-index: 10;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    margin: 8px;
    width: fit-content;
    min-width: 120px;
    &:hover {
      background: $default-badge-border;
      border: 1px solid $default-badge-border;
    }
    .value {
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $default;
    }
    .description {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: $default;
    }
  }
}
</style>
