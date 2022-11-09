const knex = require('knex')
const config = require('../../knexfile')
const db = knex(config.development)

class Account {

    // tested
    static async create(account) {
        if (Account.validate(account)) {
            account.user_id = account.userId
            delete account.userId
            const id = await db('accounts').insert(account)
            account.id = id[0]
            return account
        } else {
            return undefined
        }
    }

    // tested
    static validate(account) {
        let valid = true
        if (!account.iban) valid = false
        if (!account.balance) valid = false
        if (!account.userId) valid = false
        return valid
    }

    // tested
    static async getAll() {
        return await db.select().table('accounts')
    }

    // tested
    static async getOne(id) {
        const account = await db('accounts').where({id})
        
        /**
         * In case of wish not found, knex returns an empty array.
         * Otherwise, it returns an array with just one item inside,
         * which would be the wish we're looking for.
         */
         if (account.length === 0) return undefined
         return account[0]
    }

    static async getAllOfOneUser(userId) {
        return await db('accounts').where({ user_id: userId })
    }

    // tested
    static async patch(id, patches) {
        const accountToPatch = {}

        if (patches.iban) accountToPatch.iban = patches.iban
        if (patches.balance) accountToPatch.balance = patches.balance
        
        const patch = await db('accounts').where({id}).update(accountToPatch, ['id', 'iban', 'balance'])
        
        if (patch > 0) return { message: 'Account updated successfully!'}
        return undefined

    }

    // tested
    static async delete(id) {
        const deletion = await db('accounts').where({id}).del()
        
        if (deletion > 0) return { message: 'Account deleted successfully!' }
        return undefined
    }
}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = Account