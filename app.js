const express = require('express'); //express框架模块
const path = require('path'); //系统路径模块
const http = require('http'); //系统路径模块
const sockjs = require('sockjs');
const mockData = require("./mockData.json");
const hostName = '127.0.0.1'; //ip
const port = 10221; //端口
// 1. sockjs options
const sockjs_opts = {
  prefix: '/senseface/stomp'
};

const sockjs_echo = sockjs.createServer(sockjs_opts);

const app = express();

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `http://${hostName}`);
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  res.header("X-Powered-By", ' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use(express.static(path.join(__dirname, 'public'))); //指定静态文件目录

const server = http.createServer(app);

sockjs_echo.installHandlers(server, sockjs_opts);

sockjs_echo.on('connection', function (conn) {

  conn.on('data', function (message) {
    var timer
    const { intervalTimer, connector } = connFunction(conn)();
    // !timer && (timer = setTimeout(() => {
    //   intervalTimer && clearInterval(intervalTimer);
    //   connector.end();
    // }, 1000))
  });
});

// const client = Stomp.over(factory);

function connFunction(conn) {
  var intervalTimer = null;
  return function () {
    if (!intervalTimer) {
      intervalTimer = setInterval(() => {
        conn.write && conn.write(JSON.stringify(mockData))
      }, 10)
    }
    return {
      intervalTimer,
      connector: conn,
    }
  }
}

server.listen(port, '0.0.0.0', () => {
  console.log(` [*] Listening on 0.0.0.0:${port}`);
});

