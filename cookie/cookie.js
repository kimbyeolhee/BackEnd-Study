const res = require('express/lib/response');
const http = require('http');

http.createServer((req, res) => {
  console.log( req.url, req.headers.cookie);
  res.writeHead(200, {'Set-Cookie': 'mycookie=test'});
  res.end('WELCOME');
})
  .listen(3000, () => {
    console.log("3000 port: 웹 서버가 실행됩니다..");
  });