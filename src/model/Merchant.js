const knex = require('knex')
const config = require('../../knexfile')
const db = knex(config.development)

class Merchant {

    static TABLE_NAME = 'merchants';

    // tested
    static async create(merchant) {
        if (Merchant.validate(merchant)) {
            const id = await db(Merchant.TABLE_NAME).insert(merchant)
            merchant.id = id[0]
            return merchant
        } else {
            return undefined
        }
    }

    // tested
    static validate(merchant) {
        let valid = true
        return valid
    }

    // tested
    static async getAll() {
        return await db.select().table(Merchant.TABLE_NAME)
    }

    static async getByMerchantID(merchantID){
        return db(Merchant.TABLE_NAME).where({merchantID}).first();
    }


    // tested
    static async patch(id, patches) {
        const accountToPatch = {}

        if (patches.iban) accountToPatch.iban = patches.iban
        if (patches.balance) accountToPatch.balance = patches.balance

        const patch = await db(Merchant.TABLE_NAME).where({id}).update(accountToPatch, ['id', 'iban', 'balance'])

        if (patch > 0) return { message: 'Merchant updated successfully!'}
        return undefined

    }

    // tested
    static async delete(id) {
        const deletion = await db(Merchant.TABLE_NAME).where({id}).del()

        if (deletion > 0) return { message: 'Merchant deleted successfully!' }
        return undefined
    }
}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = Merchant
