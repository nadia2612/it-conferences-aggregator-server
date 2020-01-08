const Sequelize = require("sequelize");
const sequelize = require("../db");

const Conference = sequelize.define("conference", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  logo_url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  start_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  link:{
    type: Sequelize.DATEONLY,
    allowNull: false

  },
  price:{
    type:Sequelize.INTEGER,
    allowNull: false
  }
});



module.exports = Conference;