const express = require("express");
const User = require("../models/schema/userSchema");
const Board = require("../models/schema/boardSchema");
const Comment = require("../models/schema/commentSchema");
const router = express.Router();

/**
 * 전체 게시물을 반환합니다.
 * @return 전체 게시물
 */

router.get("/", async (req, res) => {
  const boards = await Board.find({});
  res.status(200).json(boards);
});

/**
 * 게시물을 작성합니다.
 * @return 성공 시 201
 */

// TODO: name, content를 받는다.
router.post("/", async (req, res) => {
  const { name, content } = req.body;
  const board = new Board({     // * 객체를 만들고
    name: name,
    content: content,
  });

  // * save를 통해 데이터를 저장 -> 반환 값: 넣은 값
  // * 새로운 데이터를 생성 -> 201 CREATED
  board
    .save()
    .then((saveResult) => {
      res.status(201).json({
        result: "ok",
        data: saveResult,
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: err,
      });
    });
});

/**
 * 특정 아이디를 갖는 게시물의 정보를 반환합니다.
 * @param id 아이디
 * @return 게시물 정보 (댓글 포함)
 */

router.get("/:id", async (req, res) => {

});

/**
 * 특정 아이디를 갖는 게시물에 댓글을 답니다.
 * @param id 아이디
 * @return 성공시 201, 게시물이 존재하지 않을 시 404
 */

// ! 순서
// ? 1. id 추출
// ? 2. id로 board를 찾아서, 글이 있는지부터 확인
// ? 3. 글이 없으면 404, 있으면 다음 단계
// ? 4. body에서 데이터 추출해서 Comment 객체를 만들어 줘야 함
// ? 5. save
router.post("/:id/comment", (req, res) => {
  const id = req.params.id;
  const board = Board.findById(id);
  const { content } = req.body;

  if (!board) {
    return res.status(404).json({
      result: "not found",
    });
  }

  const comment = new Comment({
    content: content,
    boardId: id,
  });

  comment.save().then((saveResult) => {
    res.status(201).json({
      result: "ok",
      data: saveResult,
    });
  });
});

/**
 * 특정 게시물을 삭제합니다.
 * @param id 아이디
 * @return 성공 시 200, 존재하지 않을 시 404
 */

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  // ? findByIdAndDelete는 findById를 해주고 결과를 삭제
  // * 데이터가 있는지 없는지 여부
  // * then -> 매개변수 결과를 담음
  // * /n : 삭제 된 데이터의 수
  Board.findByIdAndDelete(id)
    .then((output) => {
      if(output.n === 0) {
        return res.status(404).json({
          result: "not found",
        })
      }
      res.status(200).json({
        result: "ok",
      })
    })
});

/**
 * 특정 게시물을 대체합니다.
 * @param id 게시물의 id
 * @return 성공 시 200, 존재하지 않을 시 404
 */

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, content } = req.body;
  
  // * 첫 번째 매개변수로 id, 두 번째로는 바뀔 값
  Board.findByIdAndUpdate(id, {
    name: name,
    content: content
  }).then((output) => {
    if(output.n === 0) {
      return res.status(404).json({
        result: "not found",
      })
    }
    res.status(200).json({
      result: "ok",
    })
  })
});

module.exports = router;
