// models는 데이터베이스의 각 테이블에 대항하는 파일들을 담는 폴더
const { Router } = require('express');
const router = Router();

const Note = require('../models/notes');

router.get('/', (req, res) => {
    const note = Note.list();
    res.json(note);
})

router.get('/:id', (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const note = Note.get(id);
        res.json(note);
    } catch (e) {
        next(e);
    }
});

router.post('/', (req, res, next) => {
    const { title, content } = req.body;
    const note = Note.create(title, content);
    res.json(note);
});

router.put('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    try {
        const note = Note.update(id, title, content);
        res.json(note);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', (req, res, next) => {
    const id = Number(req.params.id);

    try {
        Note.delete(id);
        res.json({result: 'success'});
    } catch (e) {
        next(e);
    }
})

module.exports = router;
