const express = require('express');
const { Client } = require('ssh2');
const http = require('http');
const socketIO = require('socket.io');

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
          socket.emit('output', data.toString());
        }).stderr.on('data', (data) => {
          socket.emit('output', data.toString());
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
