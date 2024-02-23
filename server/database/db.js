const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('sql6685510', 'sql6685510', '5Hij3QPwjF', {
    host: 'sql6.freesqldatabase.com',
    dialect: 'mysql'
});

module.exports = sequelize