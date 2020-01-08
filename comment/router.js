const express = require("express");
const { toData } = require("../auth/jwt");
const Comment = require("./model");

const { Router } = express;
const router = new Router();

router.post(
  "/conference/:id/comment",
  async (req, res, next) => {
    try {
      const { userId } = toData(req.body.jwt);
      const comment = await Comment.create({
        userId,
        conferenceId: req.params.id,
        text: req.body.data.text
      });
      res.send(comment);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
