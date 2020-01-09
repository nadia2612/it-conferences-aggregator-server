const express = require("express");
const Conference = require("./model");
const { Router } = express;
const { Op } = require("sequelize");
const router = new Router();
const Comment=require("../comment/model")
const Favourite=require("../favourite/model")
const Location=require("../location/model")
const User =require("../user/model")


router.get("/conference", async (req, res, next) => {
  try {
    console.log("search string", req.query.search);
    const conferences = await Conference.findAll({
      offset: req.query.offset,
      limit: req.query.limit,
      where: {
        end_date: {
          [Op.gte]: new Date()
        },
        [Op.or]: [{
        name: {
          [Op.like]: `%${req.query.search}%`
        }},
         {
          description:
          {[Op.like]: `%${req.query.search}%`}}]
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
      include: [{ model: Location},{model: Comment,include: [User]}, {model:Favourite }]
    });
    res.send(conference);
  } catch (error) {
    next(error);
  }
});


module.exports = router;

