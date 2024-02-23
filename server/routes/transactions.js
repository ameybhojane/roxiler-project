const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactions');
const axios = require('axios');
const { Op } = require('sequelize');
const sequelize = require('../database/db');
const { QueryTypes } = require('sequelize');

router.get('/getAll', async (req, res) => {
    console.log(req);
    await Transaction.sync({ force: true });
    await Transaction.truncate();

    const transactions = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json ').then((response) => {
        // console.log(response.data);
        return response.data
    }).catch(err => {
        console.log(err);
    });
    await Transaction.bulkCreate(transactions);
    const dbTransactions = await Transaction.findAll({ raw: true });
    // console.log(dbTransactions);
    res.json({ mesaage: "Sucessfull", dbTransactions });

});
const getTransactionByMonth = async (req, res) => {
    console.log(req);
    const { month, text, page } = req.query
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
    )

    res.json({ transactions });
    // res.render('index', { title: 'Express' });


}

const getStatistics = async (req, res) => {
    let { month } = req.query
    month = Number(month)
    const totalSales = await sequelize.query(
        `SELECT SUM(price*sold) as totalSales FROM transactions where MONTH(dateOfSale) = ${month}`
    ).then(res => res[0][0].totalSales)
    const itemsSold = await sequelize.query(
        `SELECT count(*) as count FROM transactions where MONTH(dateOfSale) = ${month} and sold = 0`
    ).then(res => res[0][0].count)
    const itemsUnsold = await sequelize.query(
        `SELECT count(*) as count FROM transactions where MONTH(dateOfSale) = ${month} and sold = 1`
    ).then(res => res[0][0].count)

    res.json({ totalSales, itemsSold, itemsUnsold })
}

const getBarChart = async (req, res) => {
    const { month } = req.query
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
    const barData = await sequelize.query(query).then(res => res[0][0]);
    res.json({ barData });

}

const getPieDiagram = async (req, res) => {
    const { month } = req.query
    const query = `Select count(id) as value , category as label from transactions where MONTH(dateOfsale) = ${month} group by category;`
    const pieData = await sequelize.query(query).then((res) => res[0]).catch(err => console.log(err))
    res.json({ pieData })
}

router.get('/searchWith', getTransactionByMonth)
router.get('/getStatistics', getStatistics)
router.get('/getBarChart', getBarChart)
router.get('/getPieDiagram', getPieDiagram)



module.exports = router;