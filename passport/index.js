const express = require("express");
const app = express();

const passport = require("passport");
const Strategy = require("passport-local");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/users");
const Post = require("./models/posts");
const Comment = require("./models/comments");
const dotenv = require('dotenv'); // 환경 설정 파일

dotenv.config(); // 나만의 환경 설정 파일 불러오기

mongoose.connect(`mongodb+srv://${process.env.ID}:${process.env.PW}@kbh.rcun4.mongodb.net/myFirstDatabase`)
  .then(async () => {
    console.log('DB 연결 성공');
    // try catch 내부에 promise가 있다면 await를 사용해야한다.
    try {
      const test1 = new User({
        username: "elice",
        password: "1234",
      });
      await test1.save(); // promise: 내부에서 콜백함수를 실행, 내부에서 throw

      const test2 = new User({
        username: "elice2",
        password: "1234",
      });
      await test2.save();
      console.log("데이터 생성 완료");
   } catch (err) {
      console.log("데이터 이미 존재");
    }
  })
  .catch((e) => {
    console.log(e)
    console.log("DB 연결 실패");
  });

/*
  Passport 구현 방법
  1. Strategy
  2. serialize

  3. deserialize
*/

// Post 요청 시 Body 사용을 위한 미들웨어 기본 코드
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// passport 사용을 위한 미들웨어 기본코드
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// const user = {
//   username: 'elice',
//   password: '1234',
// }

// 인증 단계
passport.use(
  new Strategy(async (username, password, done) => {
    console.log("최초 로그인 상황");
    const findData = await User.findOne({username})
    
    if(findData === null) {
      done(null, false);
    }
    else if(findData.password === password) {
      done(null, findData);
    }
    else {
      done(null, false);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("브라우저랑 서버에게 로그인했다는 정보를 심는 단계")
  done(null, user); // 브라우저한테 쿠키를 주고 나한테 세션 데이터 저장
});

passport.deserializeUser((user, done) => {
  console.log("이미 정보 있음 req.user로 전달", user)
  done(null, user); // API req.user로 전달
});

// app.post에 login요청이 온다면 Strategy로 가게 하고, 성공하면 메인 페이지로, 실패하면 로그인페이지로 다시 돌아가라
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
}))

app.get("/login", (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="username">
      <input type="password" name="password" placeholder="password">
      <input type="submit" value="로그인">
    </form>
  `)
})

app.get('/logout', (req, res) => {
  req.logout(); // 내부 세션에서 알아서 지워줌
  res.redirect("/");
})

app.get("/post", (req, res) => {
  res.send(`
    <form action="/post" method="POST">
      <input type="text" name="title" placeholder="title">
      <textarea name="body" placeholder="body"></textarea>
      <input type="submit" value="게시물 작성">
    </form>
  `)
})

app.post("/post", async (req, res) => {
  if(req.user === undefined) {
    res.send({ status: "로그인이 필요한 서비스입니다." });
  }
  const { title, body } = req.body;
  const { username } = req.user;
  const postData = new Post({
    title: title,
    body: body,
    author: username,
    comment: [],
  });
  try{
    await postData.save();
    res.redirect("/");
  } catch(e) {
      res.send({
        status: "입력 데이터 저장 실패",
        error_message: e,
      });
  }
});

app.post('/post/:title/comment', async (req, res) => {
  if(req.user) {
    const { body } = req.body;

    const newComment = new Comment({
      body: body,
      author: req.user.username,
    });
    await newComment.save();

    // Post 스키마 내부의 comment array값을 수정
    await Post.updateOne({title: req.params.title}, {
      $push: {comment: newComment}
    });
    res.redirect(`/post/${req.params.title}`);
  } else {
    res.redirect("/");
  }
})

app.get("/post/:title", async (req, res) => {
  if(req.user) {
    const postData = await Post.findOne({
      title: req.params.title,
    }).populate("comment"); // populate를 안하면 objectId만 가져옴, 다른 schema의 objectId를 가져오는 것


    res.send(`
      <div>
        <a href="/"><p>뒤로가기</p></a>
        <h1>제목: ${postData.title}</h1>
        <p>작성자: ${postData.author}</p>
        <p>내용: ${postData.body}</p>
        <hr />

        <h2>댓글</h2>
        <form action="/post/${req.params.title}/comment" method="POST">
          <input type="text" name="body" placeholder="댓글을 입력하세요">
          <input type="submit" value="댓글 작성">
        </form>
        ${postData.comment.map(v => `
        <div>
          <p>댓글 작성자: ${v.author}</p>
          <p>댓글 내용: ${v.body}</p>
        </div>
        `)}
      </div>
    `);
  } else {
    res.redirect("/login");
  }
})

app.get("/", async (req, res) => {
  if(req.user) {

    const allPost = await Post.find({}); // 모든 Post 정보가 객체로 들어감

    res.send(`
    환영합니다. ${req.user.username}님
    <a href="/logout">로그아웃</a>
    <a href="/post">게시물 작성</a>
    <hr />

      ${allPost.map((post) => `<a href="/post/${post.title}">
        <p>${post.title} 작성자: ${post.author}</p>
      </a>`).join("")}
    `);
  } else res.redirect('/login');
});

app.listen(3000, () => console.log("3000번 포트 실행"));