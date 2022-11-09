const express = require('express')
const router = new express.Router()
const SepaTransfer = require('../model/SepaTransfer')
const auth = require('../middleware/auth')

router.post('/sepaTransfer', auth, async (req, res) => {
    try {
        const nSepaTransfer = await SepaTransfer.create({...req.body, transactionId: req.transaction.id})
        if (nSepaTransfer) {
            res.status(201).send(nSepaTransfer)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.get('/sepaTransfers', auth, async (req, res) => {
    try {
        res.status(200).send(await SepaTransfer.getAllOfOneUser(req.user.id))
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})


router.get('/sepaTransfer/:id', auth, async (req, res) => {
    try {
        const foundSepaTransfer = await SepaTransfer.getOne(req.params.id)
        if (foundSepaTransfer && foundSepaTransfer.transaction_id === req.transaction.id) {
            res.status(200).send(foundSepaTransfer)
        } else {
            res.status(404).send({ message: 'SepaTransfer not found!'})
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.delete('/sepaTransfer/:id', auth, async (req, res) => {
    try {
        const sepaTransfer = await Transaction.getOne(req.params.id)
        if (!sepaTransfer) return res.status(404).send({ message: 'SepaTransfer not found!' })
        if (sepaTransfer.transaction_id === req.transaction.id) {
            const deleteMessage = await SepaTransfer.delete(req.params.id)
            res.status(200).send(deleteMessage)
        } else {
            res.status(403).send({ message: 'This user has no access to this resource.'})
        }
        
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

module.exports = router