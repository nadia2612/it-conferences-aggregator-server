const { Router } = require("express");
const { toJWT } = require("./jwt");
const User = require("../user/model");
const router = new Router();
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send({
      message: "Please supply a valid email and password"
    });
  } else {
    await User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: "User with that email does not exist"
          });
        } else if (bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({
            jwt: toJWT({ userId: entity.id }),
            id: entity.id,
            name: entity.name
          });
        } else {
          res.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: "Something went wrong"
        });
      });
  }
});

module.exports = router;
