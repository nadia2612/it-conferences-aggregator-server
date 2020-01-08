const Sequelize = require("sequelize");
const sequelize = require("../db");
const Conference =require("../conference/model")

const Location = sequelize.define("location", {
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  
});




module.exports = Location;