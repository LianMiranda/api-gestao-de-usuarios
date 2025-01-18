const { Sequelize } = require('sequelize');
require('dotenv').config()

const connection = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql",
    timezone: "-03:00"
})

module.exports = connection