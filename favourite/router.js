const express = require("express");
const { toData } = require("../auth/jwt");
const Favourite = require("./model");
const { Router } = express;
const router = new Router();





router.post("/conference/:id", async (req, res, next) => {
  try {
    const { userId } = toData(req.body.jwt);
    const favourite = await Favourite.create({
      userId,
      eventId: req.params.id
    });
    res.send(favourite);
  } catch (error) {
    next(error);
  }
});


router.delete("/conference/:id", async (req, res, next) => {
  try {
    const { userId } = toData(req.body.jwt);

    const favourite = await Favourite.findByPk(req.params.id);
    if (favourite.userId !== userId) {
      return res
        .status(403)
        .send("You have no permissions to access this entity.");
    } else {
      await favourite.destroy();
      res.send("Deleted");
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
