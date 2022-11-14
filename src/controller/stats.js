const express = require('express')
const router = new express.Router() // Here we create the router we will be exporting later
const Cashback = require("../model/Cashback");
const CreditCardTransaction = require("../model/CreditCardTransaction");

router.get('/stats/amountByMerchant', async (req, res) => {
    try {
        const rRes = await Cashback.getTotalAmountByMerchant();
        if (rRes) {
            res.status(200).send(rRes)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
});

router.get('/stats/top10unresgitered', async (req, res) => {
    try {
        const rRes = await CreditCardTransaction.getTop10TransactionForUnregisteredMerchant();
        if (rRes) {
            res.status(200).send(rRes)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
});

router.get('/stats/merchantsWithAtLeast2Customers', async (req, res) => {
    try {
        const rRes = await CreditCardTransaction.getMerchantsWithAtLeast2Customers();
        if (rRes) {
            res.status(200).send(rRes)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
});

module.exports = router
