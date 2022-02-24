const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares.js');

const router = express.Router();

router.get('/token', async(req, res) => {
  try {
    const token = jwt.sign({
      id: 'sns 사용자 아이디',
      nick: 'consumer88',
      grade: 'premium',
    }, process.env.JWT_SECRET, {
       expiresIn: '1h',
      issuer: 'my-sns' });
    req.session.jwt = token;
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token,
    })
  }
  catch(err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    })
  }
});


router.get('/test', verifyToken, (req, res)=> {
  res.json(req.decoded)
})

module.exports = router