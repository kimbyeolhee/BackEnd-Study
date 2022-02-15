const fs = require('fs');
console.log('프로그램 시작');

// 동기
let data = fs.readFileSync('./news.txt', 'utf8');
console.log(data);

// 비동기
fs.readFile('./news.txt', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data);
})