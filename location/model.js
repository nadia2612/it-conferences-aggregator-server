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
  lat:{
    type:Sequelize.FLOAT(11)
  },
  lng:{
    type:Sequelize.FLOAT(11)
  }
});




module.exports = Location;