const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const Transaction = sequelize.define('transactions', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    sold: DataTypes.BOOLEAN,
    dateOfSale: DataTypes.DATE
});

module.exports = Transaction;