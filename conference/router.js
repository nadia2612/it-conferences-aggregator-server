const express = require("express");
const sequelize = require("sequelize");
const Conference = require("./model");
const { Router } = express;
const { Op } = require("sequelize");
const router = new Router();
const Comment = require("../comment/model");
const Favorite = require("../favorite/model");
const Location = require("../location/model");
const User = require("../user/model");
const { toData } = require("../auth/jwt");
const moment = require("moment");
const ics = require("ics");

router.get("/conference/:id/ics", async (req, res, next) => {
  const conference = await Conference.findByPk(req.params.id, {
    include: [{ model: Location }]
  });
  const startDate = moment(conference.start_date);

  const event = {
    start: [startDate.year(), startDate.month(), startDate.date()],
    duration: { hours: 24 },
    title: conference.name,
    description: conference.description,
    location: conference.location.city,
    url: conference.link,
    geo: { lat: conference.location.lat, lon: conference.location.lng },
    status: "CONFIRMED",
    busyStatus: "BUSY"
  };
  await ics.createEvent(event, (error, value) => {
    if (error) {
      next(error);
    } else {
      res.setHeader("Content-disposition", "attachment; filename=event.ics");
      res.send(value);
    }
  });
});

router.get("/conference", async (req, res, next) => {
  try {
    const conferences = await Conference.findAll({
      offset: req.query.offset,
      limit: req.query.limit,
      where: {
        end_date: {
          [Op.gte]: new Date()
        },
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${req.query.search}%`
            }
          },
          {
            description: {
              [Op.iLike]: `%${req.query.search}%`
            }
          },
          { "$location.city$": { [Op.iLike]: `%${req.query.search}%` } },
          { "$location.country$": { [Op.iLike]: `%${req.query.search}%` } }
        ]
      },
      include: [{ model: Location }]
    });
    res.send(conferences);
  } catch (error) {
    next(error);
  }
});

router.get("/conference/:id", async (req, res, next) => {
  try {
    const userId = req.query.jwt ? toData(req.query.jwt).userId : undefined;
    const conference = await Conference.findByPk(req.params.id, {
      include: [{ model: Location }, { model: Comment, include: [User] }],
      attributes: {
        include: userId
          ? [
              [
                sequelize.literal(
                  `(SELECT "favorite"."id" FROM "favorites" as "favorite" WHERE "favorite"."conferenceId" = "conference"."id" and "favorite"."userId" = ${userId})`
                ),
                "favoriteId"
              ]
            ]
          : []
      },
      group: [
        "conference.id",
        "location.id",
        "comments.id",
        "comments->user.id"
      ]
    });
    res.send(conference);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
