const Sequelize = require("sequelize");
const sequelize = require("../db");
const User = require("../user/model");
const Conference = require("../conference/model");

const Favorite = sequelize.define("favorite");

Favorite.belongsTo(Conference);
Conference.hasMany(Favorite);
User.hasMany(Favorite);
Favorite.belongsTo(User, { through: Conference });

module.exports = Favorite;
