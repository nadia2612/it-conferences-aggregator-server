const express = require("express");
const Conference = require("./model");
const { Router } = express;
const { Op } = require("sequelize");
const router = new Router();
const Comment=require("../comment/model")
const Favourite=require("../favourite/model")


router.get("/conference", async (req, res, next) => {
  try {
    const conferences = await Conference.findAll({
      offset: req.query.offset,
      limit: req.query.limit,
      where: {
        end_date: {
          [Op.gte]: new Date()
        }
      }
    });
    res.send(conferences);
  } catch (error) {
    next(error);
  }
});

router.get("/conference/:id", async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name"] }]
    });
    res.send(conference);
  } catch (error) {
    next(error);
  }
});


module.exports = router;

