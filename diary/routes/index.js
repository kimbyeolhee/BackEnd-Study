const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    console.log(users)
    // res.send("Hello, world.")
    // console.log(res.render)
    res.render('mongoose', { users }); // mongoose.html에 users라는 변수를 전달해줌
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
