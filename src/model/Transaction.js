const knex = require('knex')
const config = require('../../knexfile')
const AmountUnit = require("./Transaction");
const db = knex(config.development)

class Transaction{

    static TABLE_NAME = 'transactions';

    static AMOUNT_UNIT_CENTS = 'CENTS';
    static AMOUNT_UNIT_SINGLE = 'SINGLE';

    // tested
    static async create(transaction) {
        if (Transaction.validate(transaction)) {
            let dbTransaction = {};
            dbTransaction.type = transaction.type;
            dbTransaction.transaction_id = transaction.transactionId;
            dbTransaction.account_id = transaction.accountId;

            if(transaction.unit && transaction.unit.toLowerCase() === Transaction.AMOUNT_UNIT_SINGLE.toLowerCase()){
                dbTransaction.amount = transaction.amount * 100;
            } else{
                dbTransaction.amount = transaction.amount;
            }

            dbTransaction.currency = transaction.currency;
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
        let valid = true
        if (!transaction.amount) valid = false
        if (!transaction.type) valid = false
        if (!transaction.transactionId) valid = false
        if (!transaction.accountId) valid = false
        return valid
    }

    static async getAllOfOneUser(accountId) {
        return await db('transactions').where({ account_id: accountId })
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
