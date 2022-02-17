const express = require("express");
const bodyParser = require("body-parser");
const index = require("./routes/index");
const app = express();



app.use(bodyParser.urlencoded({ extended: false }));

// 라우터 연결
app.use("/routes/", index);

/*******************************************/
let func1 = (req, res) => {
    console.log("배고프다")
}

app.get("/", (req, res, next) => {
    res.send("안녕");
    next(); //위치 상 다음 미들웨어를 실행(func1이 실행됨)
});

app.use(func1);
/****************************************** */

// 서버 켜기
app.listen(3000, () => {
    console.log("서버가 시작되었습니다.");
});