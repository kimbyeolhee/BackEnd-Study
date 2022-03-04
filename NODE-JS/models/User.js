const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  }
})

// 저장하기 전에 function을 진행한 후 index.js의 save가 실행
userSchema.pre("save", function(next) {
  var user = this;

  // 비밀번호 암호화
  if(user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else { //다른 것을 바꿀 때는 그냥 나가야 함
    next();
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  })
}

userSchema.methods.generateToken = function(cb) {
  const user = this;
  // jsonwebtoken을 이용해 token 생성
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function(err, user) {
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb) {
  const user = this;
  // 토큰 decode
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 아이디를 이용해 유저 찾기 
    // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
    user.findOne({ "_id" : decoded, "token": token }, function(err, user) {
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model("User", userSchema);

module.exports = { User };