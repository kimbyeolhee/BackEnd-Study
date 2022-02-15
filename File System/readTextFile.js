// File System은 파일처리와 관련된 작업을 하고 nodejs에서 가장 중요한 모듈 중 하나

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