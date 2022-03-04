const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const moongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World!'));


app.post('/api/user/register', (req, res) => {
  //회원 가입할 때 필요한 정보를 client에서 가져온다.
  const user = new User(req.body);
  // 그것들을 데이터 베이스에 넣어준다.
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err });
    console.log(userInfo);
    return res.status(200).json({
      success: true
    });
  })
})


app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호를 비교
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
      
      // 비밀번호까지 맞다면 토큰 생성
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);
      
      // 토큰을 저장
      res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
      })
    })
  })
})


app.get('/api/users/auth', auth ,(req, res) => {
  req.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
      { token: "" },
      (err, user) => {
        if(err) return res.json({ success: false, err});
        return res.status(200).send({
          success: true
        })
      })
})


app.listen(port);