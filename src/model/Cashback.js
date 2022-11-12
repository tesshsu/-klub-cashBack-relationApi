const knex = require('knex')
const config = require('../../knexfile')
const db = knex(config.development)

class Cashback {

    static TABLE_NAME = 'cashbacks';

    // tested
    static async create(cashback) {
        if (Cashback.validate(cashback)) {
            const id = await db(Cashback.TABLE_NAME).insert(cashback)
            cashback.id = id[0]
            return cashback
        } else {
            return undefined
        }
    }

    // tested
    static validate(cashback) {
        let valid = true
        if (!cashback.status) valid = false
        if (!cashback.amount) valid = false
        if (!cashback.transaction_id) valid = false
        return valid
    }


}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = Cashback
