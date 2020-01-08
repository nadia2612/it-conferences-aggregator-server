const Sequelize = require("sequelize");
const sequelize = require("../db");
const User = require("../user/model");
const Conference = require("../conference/model");

const Favourite = sequelize.define("favourite");

Favourite.belongsTo(Conference);
Conference.hasMany(Favourite);
User.hasMany(Favourite);
Favourite.belongsTo(User, { through: Conference });

module.exports = Favourite;
