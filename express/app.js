const express = require('express');
const path = require('path');
const app = express();

// pug template engine 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 메뉴 추천
const pickMenu = () => {
    const food = ['김치찌개', '수제비', '파전', '칼국수', '순두부찌개', '부대찌개'];
    let ind = Math.floor(Math.random() * food.length);
    return food[ind]
}

app.get('/food', (req, res) => {
    let menu = pickMenu();
    res.send(`오늘의 추천 메뉴는 ${menu} 입니다.`);
});

// 운명의 상대 추천 
const mbti = ['INTJ - 용의주도한 전략가 (Architect)',
    '​INTP - 논리적인 사색가 (Logician)',
    'ENTJ - 대담한 ​통솔자 (Commander)',
    'ENTP - ​뜨거운 논쟁을 즐기는 변론가 (Debater)',
    'INFJ - 선의의 옹호자 (Advocate)',
    'INFP - ​열정적인 중재자 (Mediator)',
    'ENFJ - 정의로운 사회운동가 (Protagonist)',
    'ENFP - ​재기발랄한 활동가 (Campaigner)',
    'ISTJ - 청렴결백한 논리주의자 (Logistician)',
    'ISFJ - 용감한 수호자 (Defender)',
    'ESTJ - ​엄격한 관리자 (Executive)',
    'ESFJ - 사교적인 외교관 (Consul)',
    'ISTP - 만능 재주꾼 (Virtuoso)',
    'ISFP - ​호기심 많은 예술가 (Adventurer)',
    'ESTP - ​모험을 즐기는 사업가 (Entrepreneur)',
    'ESFP - 자유로운 영혼의 연예인 (Entertainer)]',]

app.get('/lucky', (req, res) => {
    res.send(`오늘 당신의 운명의 상대는 ${mbti[Math.floor(Math.random() * mbti.length)]} 입니다.`);
})

const indexRoute = require('./routes/index');
app.use('/', indexRoute);
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,'/index.html'));
// })

app.get('/maplestory', (req, res) => {
    res.send('Lv 254 Zero');
})
app.get('/lostark', (req, res) => {
    res.send('소서리스')
})

// error 처리
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send(err.message)
})

app.listen(3000, () => {
    console.log('3000 port running')
})