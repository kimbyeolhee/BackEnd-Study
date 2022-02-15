// node.js로 간단한 웹서버를 만들기

//createServer()는 요청받고 응답할 수 있는 http.Server 개체를 만드는 함수

//createServer()는 요청에 관한 정보를 담고있는 request와 응답에 관한 정보를 담고있는 response라는 두 개의 매개변수가 있는 함수를 인자로 받는다.

var http = require("http");

//1. 함수 `onRequest()` 인자에 request와 response를 넣어줌
function onRequest(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });

  //2. html 본문(body)에 보여지는 부분을 입력하는 메서드인 res.write()를 사용해서 "Hello World"를 띄움
  res.write("Hello World");
  console.log("server response!!!")
  //3. 응답을 종료하는 메서드인 res.end()를 작성
  res.end();
}

console.log("server start!!!")

http.createServer(onRequest).listen(8080);