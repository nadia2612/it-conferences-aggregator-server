const express = require("express");
const { toData } = require("../auth/jwt");
const Favorite = require("./model");
const { Router } = express;
const router = new Router();
const Conference = require("../conference/model");

router.get("/favorite", async (req, res, next) => {
  try {
    const userId = req.query.jwt ? toData(req.query.jwt).userId : undefined;
    const favorites = await Favorite.findAll({
      where: { userId: userId },
      include: [{ model: Conference }]
    });
    res.send(favorites);
  } catch (error) {
    next(error);
  }
});

router.post("/conference/:id/favorite", async (req, res, next) => {
  try {
    const { userId } = toData(req.body.jwt);
    const favorite = await Favorite.create({
      userId,
      conferenceId: req.params.id
    });
    res.send(favorite);
  } catch (error) {
    next(error);
  }
});

router.delete("/conference/:id/favorite", async (req, res, next) => {
  try {
    const { userId } = toData(req.body.jwt);
    const favorite = await Favorite.findOne({
      where: { conferenceId: req.params.id }
    });
    if (favorite.userId !== userId) {
      return res
        .status(403)
        .send("You have no permissions to access this entity.");
    } else {
      await favorite.destroy();
      res.send("Deleted");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
