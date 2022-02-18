const express = require("express");
const app = express();

const noteRouter = require('./routes/note');

app.get("/", (req, res) => {
    console.log("서버가 실행중입니다.")
    res.send("Main page");
})

app.use("/notes", noteRouter);

app.use((req, res, next) => {
    res.status(404);
    res.send({
        result: 'fail',
        error: `Page not found ${req.path}`
    });
});

app.use((err, req, res, next) => {
    res.status(500);

    res.json({
        result: 'fail',
        error: err.message,
    });
});

app.listen(3000);