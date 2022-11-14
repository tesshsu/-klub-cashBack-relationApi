const knex = require('knex')
const config = require('../../knexfile')
const Merchant = require("./Merchant");
const Transaction = require("./Transaction");
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
        if (!cashback.merchant_id) valid = false
        return valid
    }

    static getTotalAmountByMerchant () {
        return db.table(Cashback.TABLE_NAME)
            .select('merchant_id')
            .select(Merchant.TABLE_NAME + '.name')
            .sum('amount')
            .groupBy('merchant_id')
            .join(Merchant.TABLE_NAME, function() {
                this
                    .on(Merchant.TABLE_NAME + '.id', '=', Cashback.TABLE_NAME + '.merchant_id')
            })
    }

}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = Cashback
