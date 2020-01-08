const Sequelize = require("sequelize");
const sequelize = require("../db");
const Conference =require("../conference/model")

const Location = sequelize.define("location", {
  land: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  
});

// Location.belongsTo(Conference);
// Location.hasMany(Conference);


module.exports = Location;