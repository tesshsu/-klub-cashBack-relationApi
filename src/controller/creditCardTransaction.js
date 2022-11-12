const express = require('express')
const router = new express.Router()
const CreditCardTransaction = require('../model/creditCardTransaction')
const auth = require('../middleware/auth')

router.post('/creditCardTransaction', auth, async (req, res) => {
    try {
        const nCreditCardTransaction = await CreditCardTransaction.create({...req.body, transactionId: req.transaction.id})
        if (nCreditCardTransaction) {
            res.status(201).send(nCreditCardTransaction)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.get('/creditCardTransaction', auth, async (req, res) => {
    try {
        res.status(200).send(await CreditCardTransaction.getAllOfOneUser(req.user.id))
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})


router.get('/creditCardTransaction/:id', auth, async (req, res) => {
    try {
        const foundCbPayment = await CreditCardTransaction.getOne(req.params.id)
        if (foundCbPayment && foundCbPayment.transaction_id === req.transaction.id) {
            res.status(200).send(foundCbPayment)
        } else {
            res.status(404).send({ message: 'CbPayment not found!'})
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.delete('/creditCardTransaction/:id', auth, async (req, res) => {
    try {
        const cbPayment = await CreditCardTransaction.getOne(req.params.id)
        if (!cbPayment) return res.status(404).send({ message: 'CbPayment not found!' })
        if (cbPayment.transaction_id === req.transaction.id) {
            const deleteMessage = await CreditCardTransaction.delete(req.params.id)
            res.status(200).send(deleteMessage)
        } else {
            res.status(403).send({ message: 'This user has no access to this resource.'})
        }

    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

module.exports = router
