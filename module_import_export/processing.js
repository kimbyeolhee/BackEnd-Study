// ES6 //
// import { kor, eng, math } from './grade.js'
// package.json 파일에서 "type": "module",를 추가해야 가능

// node.js //
const grade = require('./grade.js')

console.log(grade.kor)
console.log(grade.eng)
console.log(grade.math)