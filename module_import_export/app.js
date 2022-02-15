// require()메서드로 모듈 객체를 임포트

// exports를 import
const getSquare = require('./exports.js');
console.log(getSquare.area(10));
console.log(getSquare.perimeter(10));


// module_exports를 import
const getSquare2 = require('./module_exports.js');
console.log(getSquare2.area(10));
console.log(getSquare2.perimeter(10));