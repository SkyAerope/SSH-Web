const express = require('express');
const { Client } = require('ssh2');
const http = require('http');
const socketIO = require('socket.io');
const ansiHTML = require('ansi-html');
const { parse, format } = require('date-fns');
const { el } = require('date-fns/locale');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/main.css', (req, res) => {
    res.sendFile(__dirname + '/main.css');
});

app.get('/conn.js', (req, res) => {
  res.sendFile(__dirname + '/conn.js');
});

app.get('/cookie.js', (req, res) => {
  res.sendFile(__dirname + '/cookie.js');
});
app.get('/createchart.js', (req, res) => {
  res.sendFile(__dirname + '/createchart.js');
});

app.get('/favicon.svg', (req, res) => {
    res.sendFile(__dirname + '/favicon.svg');
});

// 不需要猫咪背景图片了~
// app.get('/cat.jpg', (req, res) => {
//     res.sendFile(__dirname + '/cat.jpg');
// });



io.on('connection', (socket) => {
    //获取当前时间
  var date = new Date();
    //获取客户端IP地址
  var clientIp = socket.request.connection.remoteAddress;
  console.log('[' + date.toLocaleString() + '] ' + clientIp + ' 已连接 ');


  function handleOutput(data) {
    var lines = ansiHTML(data.toString()).split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      // BPS: -- B 替换成 BPS: 0 B
      line = line.replace(/BPS: -- B/g, 'BPS: 0 B');
      // 匹配数据行
      var match = line.match(/^\[(\d{2}:\d{2}:\d{2}) - DEBUG\] Target: [\w\.]+, Port: \d+, Method: \w+ PPS: ([\d\.k]+), BPS: ([\d\. \w\/]+) \/ (\d+%)(?:<.*>)?$/);
      if (match) {
        var timestamp = match[1];
        var pps = match[2];
        var bps = match[3];
        var progress = match[4];
  
        timestamp = parse(timestamp, 'HH:mm:ss', new Date());
        //// timestamp = format(timestamp, 'HH:mm:ss');
        //// timestamp = format(timestamp, "EEE MMM dd yyyy HH:mm:ss ");

        // pps单位处理
        if (pps.endsWith('k')) {
          pps = parseFloat(pps) * 1024;
        } else if (pps.endsWith('M')) {
          pps = parseFloat(pps) * 1024 * 1024;
        } else {
          pps = parseFloat(pps);
        }

        // bps单位处理
        if (bps.endsWith(' B')) {
          bps = parseFloat(bps) / 1024;
        } else if (bps.endsWith('kB')) {
          bps = parseFloat(bps);
        } else if (bps.endsWith('MB')) {
          bps = parseFloat(bps) * 1024;
        } else if (bps.endsWith('GB')) {
          bps = parseFloat(bps) * 1024 * 1024;
        } else {
          bps = parseFloat(bps);
        }

        // 发送处理后的数据给客户端
        socket.emit('handledData', timestamp, pps, bps, progress);
      }
    }
  }

  socket.on('execute', (command, host, port, username, password) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          socket.emit('output', '错误：' + err.message);
          conn.end();
          return;
        }

        stream.on('close', (code, signal) => {
          conn.end();
          socket.disconnect(); // 断开连接
        }).on('data', (data) => {
          // 发送原始数据以便调试
          socket.emit('output', ansiHTML(data.toString()));
          handleOutput(data);
        }).stderr.on('data', (data) => {
          socket.emit('output', ansiHTML(data.toString()));
          handleOutput(data);
        });
      });
    });

    conn.on('error', (err) => {
      socket.emit('output', 'SSH 连接错误：' + err.message);
    });

    conn.connect({
        host: host,
        port: port,
        username: username,
        password: password
      });
  });
});

server.listen(port, () => {
  console.log(`服务器已启动，访问 http://localhost:${port}`);
});
