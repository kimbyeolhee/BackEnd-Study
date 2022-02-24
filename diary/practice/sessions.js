const express = require('express')
const session = require('express-session')
const app = express()
app.use(session({
    secret: "elice racing",
    resave: false,
    saveUninitialized: true,
}))

app.get("/", (req, res) => {
    if (! req.session.num) {
        req.session.num = 1
        req.session.userName = '첫접속자'
    } else {
        console.log(req.session)
        req.session.num += 1
    }
    res.send(`Views : ${req.session.num}`)
})

app.listen(3000, () => {
    console.log('web server 3000 listening...')
})
