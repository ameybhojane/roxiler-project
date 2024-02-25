const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactions');
const axios = require('axios');
const { Op } = require('sequelize');
const sequelize = require('../database/db');
const { QueryTypes } = require('sequelize');
const { monthMapping } = require('./utils/utils');


router.get('/getAll', async (req, res) => {
    await Transaction.sync({ force: true });
    await Transaction.truncate();

    const transactions = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json ').then((response) => {
        return response.data
    }).catch(err => {
        console.log(err);
    });
    await Transaction.bulkCreate(transactions);
    const dbTransactions = await Transaction.findAll({ raw: true });
    res.json({ mesaage: "Data Seeded and Fetched Successfully", dbTransactions });

});
const getTransactionByMonth = async (req, res) => {
    const { text, page } = req.query
    let { month } = req.query
    if (typeof (month) == "string") {
        month = month.trim().toLowerCase();
        month = monthMapping[month] || Number(month)
    }
    month = Number(month)
    if (isNaN(month) || month > 12) {
        res.status(400).json({ error: "Please enter a valid month" })
    }
    let query;
    if (text) {
        query = `SELECT * FROM transactions where MONTH(dateOfSale) = ${month}
                AND (description like '%${text}%' or title like '%${text}%' or price like '%${text}%' )`
    } else {

        query = `SELECT * FROM transactions where MONTH(dateOfSale) = ${month} `
    }
    if (page) {
        query += ` ORDER BY ID LIMIT 10 OFFSET ${(Number(page) - 1) * 10}`
    }
    const transactions = await sequelize.query(query,
        { type: QueryTypes.SELECT, raw: true }
    ).catch(err => res.status(400).json({ error: "Error while Quering DB", err }))

    res.json({ transactions });

}

const getStatistics = async (req, res) => {
    let { month } = req.query
    if (typeof (month) == "string") {
        month = month.trim().toLowerCase();
        month = monthMapping[month] || Number(month)
    }
    month = Number(month)
    if (isNaN(month) || month > 12) {
        res.status(400).json({ error: "Please enter a valid month" })
    }
    const totalSales = await sequelize.query(
        `SELECT SUM(price*sold) as totalSales FROM transactions where MONTH(dateOfSale) = ${month}`
    ).then(res => res[0][0].totalSales).catch(err => res.status(400).json({ error: "Error while Quering DB", err }))
    const itemsSold = await sequelize.query(
        `SELECT count(*) as count FROM transactions where MONTH(dateOfSale) = ${month} and sold = 0`
    ).then(res => res[0][0].count).catch(err => res.status(400).json({ error: "Error while Quering DB", err }))
    const itemsUnsold = await sequelize.query(
        `SELECT count(*) as count FROM transactions where MONTH(dateOfSale) = ${month} and sold = 1`
    ).then(res => res[0][0].count).catch(err => res.status(400).json({ error: "Error while Quering DB", err }))

    res.json({ totalSales, itemsSold, itemsUnsold })
}

const getBarChart = async (req, res) => {
    let { month } = req.query
    if (typeof (month) == "string") {
        month = month.trim().toLowerCase();
        month = monthMapping[month] || Number(month)
    }
    month = Number(month)
    if (isNaN(month) || month > 12) {
        res.status(400).json({ error: "Please enter a valid month" })
    }
    const query = `Select
                SUM(Case When price <= 100 then 1 else 0 end) as '0-100',
                SUM(Case When price <= 200 and price > 100 then 1 else 0 end) as '101-200',
                SUM(Case When price <= 300 and price > 200 then 1 else 0 end) as '201-300',
                SUM(Case When price <= 400 and price > 300 then 1 else 0 end) as '301-400',
                SUM(Case When price <= 500 and price > 400 then 1 else 0 end) as '401-500',
                SUM(Case When price <= 600 and price > 500 then 1 else 0 end) as '501-600',
                SUM(Case When price <= 700 and price > 600 then 1 else 0 end) as '601-700',
                SUM(Case When price <= 800 and price > 700 then 1 else 0 end) as '701-800',
                SUM(Case When price <= 900 and price > 800 then 1 else 0 end) as '801-900',
                SUM(Case When price  > 900 then 1 else 0 end) as '901 and above'
                from transactions where MONTH(dateOfSale) = ${month}
    `
    const barData = await sequelize.query(query).then(res => res[0][0]).catch(err => res.status(400).json({ error: "Error while Quering DB", err }));
    res.json({ barData });

}

const getPieDiagram = async (req, res) => {
    let { month } = req.query
    if (typeof (month) == "string") {
        month = month.trim().toLowerCase();
        month = monthMapping[month] || Number(month)
    }
    month = Number(month)
    if (isNaN(month) || month > 12) {
        res.status(400).json({ error: "Please enter a valid month" })
    } const query = `Select count(id) as value , category as label,id from transactions where MONTH(dateOfsale) = ${month} group by category;`
    const pieData = await sequelize.query(query).then((res) => res[0]).catch(err => res.status(400).json({ error: "Error while Quering DB", err }))
    res.json({ pieData })
}

const getAllStats = async (req, res) => {
    let { month } = req.query
    if (typeof (month) == "string") {
        month = month.trim().toLowerCase();
        month = monthMapping[month] || Number(month)
    }
    month = Number(month)
    if (isNaN(month) || month > 12) {
        res.status(400).json({ error: "Please enter a valid month" })
    }
    const host = "https://roxiler-project-3h6z.vercel.app"
    const totalSales = await axios.get(`${host}/transactions/getStatistics?month=${month}`).then(res => res.data).catch(err => res.status(400).json({ error: "Error while Fetching through API", err }))
    const barData = await axios.get(`${host}/transactions/getBarChart?month=${month}`).then(res => res.data).catch(err => res.status(400).json({ error: "Error while Fetching through API", err }))
    const pieData = await axios.get(`${host}/transactions/getPieDiagram?month=${month}`).then(res => res.data).catch(err => res.status(400).json({ error: "Error while Fetching through API", err }))

    res.json({ totalSales, barData, pieData })
}
router.get('/searchWith', getTransactionByMonth)
router.get('/getStatistics', getStatistics)
router.get('/getBarChart', getBarChart)
router.get('/getPieDiagram', getPieDiagram)
router.get('/getAllStats', getAllStats)

module.exports = router;