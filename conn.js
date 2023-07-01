let socket;
function connectToServer() {
  socket = io();

  socket.on('connect', () => {
    clearChart();
    console.log('实时连接建立');
    // mdui snackbar
    mdui.snackbar({
      message: '实时连接建立',
      position: 'top',
      timeout: 500
    });
  });

  //连接断开
  socket.on('disconnect', () => {
    console.log('实时连接断开');
    // mdui snackbar
    mdui.snackbar({
      message: '实时连接断开',
      position: 'top',
      timeout: 500
    });
    updateProgress('100%');
  });

  // socket.on('output', (data) => {
  //   //将data中的\n替换为<br>
  //   data = data.replace(/\n/g, '<br>');
  //   // document.getElementById('output').innerHTML += data;
  //   //图表相关
  //   // handleOutput(data);
  // });

  socket.on('handledData', (timestamp, pps, bps, progress) => {
    updateChart(chart, timestamp, pps, bps);
    updateProgress(progress);
  });

}


function executeCommand() {
    connectToServer();

  const host = document.getElementById('host').value;
  const port = document.getElementById('port').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const url = document.getElementById('url').value;
  const duration = document.getElementById('duration').value;

  const startpy = document.getElementById('startpy').value;
  const method = document.getElementById('method').value;
  const proxytype = document.getElementById('proxytype').value;
  const threads = document.getElementById('threads').value;
  const proxies = document.getElementById('proxies').value;
  const rpc = document.getElementById('rpc').value;

  const command = `python3 ${startpy} ${method} ${url} ${proxytype} ${threads} ${proxies} ${rpc} ${duration} true`;
  // document.getElementById('output').innerHTML = '';

  socket.emit('execute', command, host, port, username, password);
}

