const express = require('express')
const router = new express.Router() // Here we create the router we will be exporting later
const Account = require('../model/Account') // Here we import the Account class from the model/Account.js file
const auth = require('../middleware/auth')

router.post('/accounts', auth, async (req, res) => {
    try {
        const nAccount = await Account.create({...req.body, userId: req.user.id})
        if (nAccount) {
            res.status(201).send(nAccount)
        } else {
            res.status(400).send({ message: 'Invalid entry!' })
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.get('/accounts', auth, async (req, res) => {
    try {
        res.status(200).send(await Account.getAllOfOneUser(req.user.id))
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.patch('/account/:id', auth, async (req, res) => {
    try {
        const account = await Account.getOne(req.params.id)
        if (!account) return res.status(404).send({ message: 'Account not found!' })
        if (account.user_id === req.user.id) {
            const updatedAccount = await Account.patch(req.params.id, req.body)
            res.status(200).send(updatedAccount)
        } else {
            res.status(403).send({ message: 'This user has no access to this resource.'})
        }
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

router.delete('/accounts/:id', auth, async (req, res) => {
    try {
        const account = await Account.getOne(req.params.id)
        if (!account) return res.status(404).send({ message: 'Account not found!' })
        if (account.user_id === req.user.id) {
            const deleteMessage = await Account.delete(req.params.id)
            res.status(200).send(deleteMessage)
        } else {
            res.status(403).send({ message: 'This user has no access to this resource.'})
        }
        
    } catch(err) {
        res.status(500).send({ message: err.message })
    }
})

module.exports = router