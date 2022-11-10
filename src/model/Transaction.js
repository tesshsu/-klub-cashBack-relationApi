const knex = require('knex')
const config = require('../../knexfile')
const db = knex(config.development)

class Transaction{

    // tested
    static async createCB(transaction) {
        if (Transaction.validate(transaction)) {
            let dbTransaction = {};
            dbTransaction.type = transaction.type;
            dbTransaction.transaction_id = transaction.transactionId;
            dbTransaction.account_id = transaction.accountId;
            dbTransaction.total = transaction.total;
            dbTransaction.description = transaction.description;
            const id = await db('transactions').insert(dbTransaction)
            dbTransaction.id = id[0]
            return dbTransaction
        } else {
            return undefined
        }
    }

    // tested
    static validate(transaction) {
        console.log(transaction)
        let valid = true
        if (!transaction.total) valid = false
        if (!transaction.type) valid = false
        if (!transaction.transactionId) valid = false
        if (!transaction.accountId) valid = false
        return valid
    }

    static async createSEPA(transaction) {
        if (Transaction.validate(transaction)) {
            let dbTransaction = {};
            dbTransaction.type = transaction.type;
            dbTransaction.transaction_id = transaction.transactionId;
            dbTransaction.account_id = transaction.accountId;
            dbTransaction.total = transaction.total;
            dbTransaction.description = transaction.description;
            const id = await db('transactions').insert(dbTransaction)
            dbTransaction.id = id[0]
            return dbTransaction
        } else {
            return undefined
        }
    }

    // tested
    static async getAll() {
        return await db.select().table('transaction')
    }

    // tested
    static async getOne(id) {
        const transaction = await db('transaction').where({id})

        /**
         * In case of wish not found, knex returns an empty array.
         * Otherwise, it returns an array with just one item inside,
         * which would be the wish we're looking for.
         */
         if (transaction.length === 0) return undefined
         return transaction[0]
    }

    static async getAllOfOneUser(accountId) {
        return await db('transactions').where({ account_id: accountId })
    }

    // tested
    static async patch(id, patches) {
        const transactionToPatch = {}

        if (patches.type) transactionToPatch.type = patches.type
        if (patches.total) transactionToPatch.total = patches.total
        if (patches.extra) transactionToPatch.extra = patches.extra
        const patch = await db('accounts').where({id}).update(accountToPatch, ['id', 'type', 'total', 'extra'])

        if (patch > 0) return { message: 'Transaction updated successfully!'}
        return undefined

    }

    // tested
    static async delete(id) {
        const deletion = await db('transactions').where({id}).del()

        if (deletion > 0) return { message: 'Transaction deleted successfully!' }
        return undefined
    }
}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = Transaction
