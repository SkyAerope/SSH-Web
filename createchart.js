// 根据设备宽度设置不同的宽高比
if (window.innerWidth <= 600) {
  aspectRatio = 1
} else {
  aspectRatio = 3
}

// 创建图表
function createChart() {
  var ctx = document.getElementById('chart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'PPS',
          yAxisID: 'pps',
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          data: [],
          tension: 0.3,
          order: 2
        },
        {
          label: 'BPS',
          yAxisID: 'bps',
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          data: [],
          tension: 0.3,
          order: 1
        }
      ]
    },
    options: {
      responsive: true, // 设置为响应式
      aspectRatio: aspectRatio, // 设置宽高比
      scales: {
        x: {
          type: 'time',
          time: {
            parser: 'date-fns',
            unit: 'second',
            displayFormats: {
              second: 'HH:mm:ss'
            }
          },
          title: {
            display: true,
            text: '时间'
          }
        },
        pps: {
          position: 'left',
          title: {
            display: true,
            text: '数据包数量'
          }
        },
        bps: {
          position: 'right',
          title: {
            display: true,
            text: '流量(kB)'
          }
        }
      },
    }
  });
  return chart;
}
// 更新图表数据
function updateChart(chart, timestamp, pps, bps) {
  var currentTime = new Date();
  //使用服务端发送的时间会导致无法绘制图表，尚未解决此问题。
  ////console.log(timestamp);
  ////console.log(currentTime);
  chart.data.labels.push(currentTime);
  // chart.data.datasets[0].data.push({ x: timestamp, y: pps });
  // chart.data.datasets[1].data.push({ x: timestamp, y: bps });
  chart.data.datasets[0].data.push({ x: currentTime, y: pps });
  chart.data.datasets[1].data.push({ x: currentTime, y: bps });
  // 保持最大数据点数为30
  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
  }
  chart.update();
}
// 更新进度条
function updateProgress(progress) {
  var progressBar = document.getElementById('progress-bar');
  progressBar.querySelector('.mdui-progress-determinate').style.width = progress;
}
// 清空图表数据
function clearChart() {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.update();
}
// 创建图表实例
var chart = createChart();