const express = require("express");
const Conference = require("./model");
const { Router } = express;
const { Op } = require("sequelize");
const router = new Router();
const Comment=require("../comment/model")
const Favourite=require("../favourite/model")
const Location=require("../location/model")


router.get("/conference", async (req, res, next) => {
  try {
    const conferences = await Conference.findAll({
      offset: req.query.offset,
      limit: req.query.limit,
      where: {
        end_date: {
          [Op.gte]: new Date()
        }
      }, include:[{model:Location, attributes:["city","country"]}]
    });
    res.send(conferences);
  } catch (error) {
    next(error);
  }
});

router.get("/conference/:id", async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id, {
      include: [{ model: Location }]
    });
    res.send(conference);
  } catch (error) {
    next(error);
  }
});


module.exports = router;

