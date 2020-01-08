const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("./model");
const router = new Router();

router.post("/user", async (req, res, next) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    const createdUser = await User.create(user);
    res.send(createdUser);
  } catch (error) {
    next(error);
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await User.findAll();
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
