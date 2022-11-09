const knex = require('knex')
const config = require('../../knexfile')
const Transaction = require("./Transaction");
const db = knex(config.development)

class CbPayment extends Transaction{

    // tested
    static async create(cbPayment) {
        if (CbPayment.validate(cbPayment)) {
            cbPayment.transaction_id = cbPayment.transactionId
            delete cbPayment.transactionId
            const id = await db('cbPayments').insert(cbPayment)
            cbPayment.id = id[0]
            return cbPayment
        } else {
            return undefined
        }
    }

    // tested
    static validate(cbPayment) {
        let valid = true
        if (!cbPayment.transactionId) valid = false
        return valid
    }

    // tested
    static async getAll() {
        return db.select().table('cbPayments')
    }

    // tested
    static async getOne(id) {
        const cbPayment = await db('cbPayments').where({id})
        
        /**
         * In case of wish not found, knex returns an empty array.
         * Otherwise, it returns an array with just one item inside,
         * which would be the wish we're looking for.
         */
         if (cbPayment.length === 0) return undefined
         return cbPayment[0]
    }

    // tested
    static async delete(id) {
        const deletion = await db('cbPayments').where({id}).del()
        
        if (deletion > 0) return { message: 'CbPayment deleted successfully!' }
        return undefined
    }
}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = CbPayment