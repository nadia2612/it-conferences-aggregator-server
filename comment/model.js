const Sequelize = require("sequelize");
const sequelize = require("../db");
const Conference = require("../conference/model");
const User = require("../user/model");

const Comment = sequelize.define("comment", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Comment.belongsTo(User);
Comment.belongsTo(Conference);
Conference.hasMany(Comment);
User.hasMany(Comment);

module.exports = Comment;
