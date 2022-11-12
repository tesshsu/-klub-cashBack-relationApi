const express = require('express')
const router = new express.Router()
const Transaction = require('../model/Transaction')
const auth = require('../middleware/auth')
const Account = require("../model/Account");
const CreditCardTransaction = require("../model/CreditCardTransaction");
const SepaTransfer = require("../model/SepaTransfer");
const User = require("../model/User");
const AmountUnit = require("../model/Transaction");
const Merchant = require("../model/Merchant");
const Cashback = require("../model/Cashback");

router.post('/webhooks/transactions', async(req, res) => {
    try {
        const user = await User.getOneByEmail('kevin@domain.com');
        const userAccount = await Account.getMyAccount(user.id);
        let transaction = {};
        if (req.body.type === 'CARD_AUTHORIZATION') {
            transaction.type = 'cb_payment';
            const creditCardTransaction = {};
            creditCardTransaction.merchantId = req.body.meta_info.merchant.id;
            creditCardTransaction.merchantCategoryCode = req.body.meta_info.merchant.category_code;
            creditCardTransaction.merchantName = req.body.meta_info.merchant.name;
            creditCardTransaction.countryCode = req.body.meta_info.merchant.country_code;

            const cb_payment = await CreditCardTransaction.create(creditCardTransaction);
            transactionId = cb_payment.id;
        } else if (req.body.type === 'sepa_transfer') {
            transaction.type = 'sepa_transfer';
            const sepa_Transfer = await SepaTransfer.create(req.body);
            transactionId = sepa_Transfer.id;
        }

        transaction.amount = req.body.amount.value;
        transaction.unit = req.body.amount.unit;
        transaction.currency = req.body.amount.currency;

        const nTransaction = await Transaction.create({
            ...transaction,
            accountId: userAccount.id,
            transactionId: transactionId
        });

        // Handle cashback
        const merchant = await Merchant.getByMerchantID(req.body.meta_info.merchant.id);
        if(merchant){
            let cashback = {};
            cashback.status = 'pending';
            cashback.amount = Math.round(transaction.amount * merchant.cashback / 100);
            cashback.transaction_id = transactionId;
            const nCashback = await Cashback.create({
                ...cashback
            });
        }

        if (nTransaction) {
            res.status(201).send(nTransaction)
        } else {
            res.status(400).send({message: 'Invalid entry!'})
        }
    } catch (err) {
        res.status(500).send({message: err.message})
    }
})


module.exports = router
