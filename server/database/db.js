const { Sequelize } = require("sequelize");
const mysql2 = require('mysql2')

const sequelize = new Sequelize('sql6685510', 'sql6685510', '5Hij3QPwjF', {
    host: 'sql6.freesqldatabase.com',
    dialect: 'mysql',
    dialectModule: mysql2
});

module.exports = sequelize