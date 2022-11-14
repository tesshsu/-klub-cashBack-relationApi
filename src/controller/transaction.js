const express = require('express')
const router = new express.Router()
const Transaction = require('../model/Transaction')
const auth = require('../middleware/auth')
const Account = require("../model/Account");
const CreditCardTransaction = require("../model/CreditCardTransaction");
const SepaTransfer = require("../model/SepaTransfer");

router.post('/transactions', auth, async(req, res) => {
    try {
        const userAccount = await Account.getMyAccount(req.user.id);
        let transactionId = undefined;
        if (req.body.type === 'cb_payment') {
            const cb_payment = await CreditCardTransaction.create(req.body);
            transactionId = cb_payment.id;
        } else if (req.body.type === 'sepa_transfer') {
            const sepa_Transfer = await SepaTransfer.create(req.body);
            transactionId = sepa_Transfer.id;
        }

        const nTransaction = await Transaction.create({
            ...req.body,
            accountId: userAccount.id,
            transactionId: transactionId
        })
        if (nTransaction) {
            res.status(201).send(nTransaction)
        } else {
            res.status(400).send({message: 'Invalid entry!'})
        }
    } catch (err) {
        res.status(500).send({message: err.message})
    }
})

router.get('/transactions', auth, async(req, res) => {
    try {
        res.status(200).send(await Transaction.getAllOfOneUser(req.user.id))
    } catch (err) {
        res.status(500).send({message: err.message})
    }
})



router.delete('/transactions/:id', auth, async(req, res) => {
    try {
        const transaction = await Transaction.getOne(req.params.id)
        if (!transaction) return res.status(404).send({message: 'Transaction not found!'})
        if (transaction.account_id === req.account.id) {
            const deleteMessage = await Transaction.delete(req.params.id)
            res.status(200).send(deleteMessage)
        } else {
            res.status(403).send({message: 'This user has no access to this resource.'})
        }

    } catch (err) {
        res.status(500).send({message: err.message})
    }
})

module.exports = router
