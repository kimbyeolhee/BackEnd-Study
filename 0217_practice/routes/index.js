const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("안녕");
})

// Q. 어떤 수를 받아서 이 수가 짝수인지, 홀수인지 알고싶다.

router.get("/is_odd/:id", (req, res) => {
    console.log(req.params.id);  // params : 주소에 추가적으로 들어오는 매개변수
    res.send(req.params.id);
})

router.get("/count-form", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/get.html"));
});

router.get("/count", (req, res) => {
    const number = parseInt(req.query.number); // query는 form(GET)에서 데이터를 가져올 수 있는 방법 (input의 name이 number임)
    if (number % 2 === 0) {
        res.send("짝수입니다.")
    } else {
        res.send("홀수입니다.")
    }
})


// post : 데이터를 전송할 떄 사용
router.get("/post-form", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/post.html"));
});

router.post("/count", (req, res) => {
    const number = req.body.number;
})

module.exports = router;