const express = require('express')
const router = new express.Router()
const Transaction = require('../model/Transaction')
const auth = require('../middleware/auth')
const Account = require("../model/Account");
const CbPayment = require("../model/CbPayment");
const SepaTransfer = require("../model/SepaTransfer");
router.post('/transactions/cbPayment', auth, async (req, res) => {
    try {
        const userAccount = await Account.getMyAccount(req.user.id);
        let transactionId = undefined;
        if(req.body.type === 'cb_payment'){
            const cb_payment = await CbPayment.create(req.body );
            transactionId = cb_payment.id;
        }

        const nTransaction = await Transaction.createCB({...req.body, accountId: userAccount.id, transactionId: transactionId})
        if (nTransaction) {
            res.status(201).send(nTransaction)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.post('/transactions/sepaTransfer', auth, async (req, res) => {
    try {
        const userAccount = await Account.getMyAccount(req.user.id);
        let transactionId = undefined;
        console.log('userAccount', userAccount.id)
        if(req.body.type === 'sepa_transfer'){
            console.log('sepa_transfer', req.body.type)
            const sepa_Transfer= await SepaTransfer.create(req.body );
            transactionId = sepa_Transfer.id;
            console.log('transactionId', transactionId)
        }

        const nTransaction = await Transaction.createSEPA({...req.body, accountId: userAccount.id, transactionId: transactionId})
        if (nTransaction) {
            res.status(201).send(nTransaction)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})


router.get('/transactions', auth, async (req, res) => {
    try {
        res.status(200).send(await Transaction.getAllOfOneUser(req.user.id))
       // res.status(200).send(await CbPayment.getAll(1/*req.user.id*/))
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})


router.get('/transactions/:id', auth, async (req, res) => {
    try {
        const foundTransaction = await Transaction.getOne(req.params.id)
        if (foundTransaction && foundTransaction.account_id === req.account.id) {
            res.status(200).send(foundTransaction)
        } else {
            res.status(404).send({ message: 'Transaction not found!'})
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})


router.patch('/transaction/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.getOne(req.params.id)
        if (!transaction) return res.status(404).send({ message: 'Transaction not found!' })
        if (transaction.user_id === req.user.id) {
            const updatedTransaction = await Transaction.patch(req.params.id, req.body)
            res.status(200).send(updatedTransaction)
        } else {
            res.status(403).send({ message: 'This user has no access to this resource.'})
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})


router.delete('/transactions/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.getOne(req.params.id)
        if (!transaction) return res.status(404).send({ message: 'Transaction not found!' })
        if (transaction.account_id === req.account.id) {
            const deleteMessage = await Transaction.delete(req.params.id)
            res.status(200).send(deleteMessage)
        } else {
            res.status(403).send({ message: 'This user has no access to this resource.'})
        }

    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

module.exports = router
