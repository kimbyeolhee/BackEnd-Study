// module.exports는 개별 함수가 아닌 객체를 통째로 exports

module.exports = {
    area: (width) => Math.pow(width, 2),
    perimeter: (width) => width*4,
}