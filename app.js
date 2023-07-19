const express = require('express');
const { Client } = require('ssh2');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.post('/execute', (req, res) => {
  const command = req.body.command;
  const host = req.body.host;
  const port = req.body.port;
  const username = req.body.username;
  const password = req.body.password;
  
  const conn = new Client();

  conn.on('ready', () => {
    conn.exec(command, (err, stream) => {
      if (err) {
        res.send('错误：' + err.message);
        conn.end();
        return;
      }

      stream.on('close', (code, signal) => {
        res.send(output);
        conn.end();
      }).on('data', (data) => {
        output += data.toString();
      }).stderr.on('data', (data) => {
        output += data.toString();
      });
    });
  });

  conn.on('error', (err) => {
    res.send('SSH 连接错误：' + err.message);
  });

  conn.connect({
    host: host,
    port: port,
    username: username,
    password: password
  });
});

server.listen(port, () => {
  console.log(`服务器已启动，访问 http://localhost:${port}`);
});
