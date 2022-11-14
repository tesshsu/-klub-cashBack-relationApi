const knex = require('knex')
const config = require('../../knexfile')
const Transaction = require("./Transaction");
const Merchant = require("./Merchant");
const db = knex(config.development)

class CreditCardTransaction extends Transaction{
    static TABLE_NAME = 'credit_card_transaction';

    // tested
    static async create(creditCardTransaction) {
        if (CreditCardTransaction.validate(creditCardTransaction)) {
            let dbCreditCardTransaction = {};
            dbCreditCardTransaction.merchantId = creditCardTransaction.merchantId;
            dbCreditCardTransaction.merchantCategoryCode = creditCardTransaction.merchantCategoryCode
            dbCreditCardTransaction.merchantName = creditCardTransaction.merchantName
            dbCreditCardTransaction.countryCode = creditCardTransaction.countryCode
            const id = await db(CreditCardTransaction.TABLE_NAME).insert(dbCreditCardTransaction);
            dbCreditCardTransaction.id = id[0]
            return dbCreditCardTransaction;
        } else {
            return undefined
        }
    }

    // tested
    static validate(creditCardTransaction) {
        let valid = true
        if (!creditCardTransaction.merchantId) valid = false
        if (!creditCardTransaction.merchantCategoryCode) valid = false
        if (!creditCardTransaction.merchantName) valid = false
        if (!creditCardTransaction.countryCode) valid = false
        return valid
    }

    // tested
    static async getAll() {
        return db.select().table('transactions')
            .where('type', '=',  'cb_payment')
            .join(CreditCardTransaction.TABLE_NAME, function() {
                this
                    .on(CreditCardTransaction.TABLE_NAME + '.id', '=', 'transactions.transaction_id')
            })
    }

    // tested
    static async getOne(id) {
        const creditCardTransaction = await db(CreditCardTransaction.TABLE_NAME).where({id})

        /**
         * In case of wish not found, knex returns an empty array.
         * Otherwise, it returns an array with just one item inside,
         * which would be the wish we're looking for.
         */
         if (creditCardTransaction.length === 0) return undefined
         return creditCardTransaction[0]
    }

    // tested
    static async delete(id) {
        const deletion = await db(CreditCardTransaction.TABLE_NAME).where({id}).del()

        if (deletion > 0) return { message: 'creditCardTransaction deleted successfully!' }
        return undefined
    }

    static async getTop10TransactionForUnregisteredMerchant () {
        const subquery = db.table(Merchant.TABLE_NAME)
            .select('merchantId').distinct();

        return db.table(CreditCardTransaction.TABLE_NAME)
            .select('merchantId')
            .select('merchantName')
            .count('id', {as: 'count'}).groupBy('merchantId')
            .where('merchantId', 'not in', subquery)
            .orderBy('count', 'desc')
            .limit(10);
    }


    static async getMerchantsWithAtLeast2Customers () {
        return db.table(CreditCardTransaction.TABLE_NAME)
            .select('merchantId')
            .select('merchantName')
            .countDistinct(Transaction.TABLE_NAME + '.account_id', { as: 'customersCount'})
            .join(Transaction.TABLE_NAME, function() {
                this
                    .on(Transaction.TABLE_NAME + '.transaction_id', '=', CreditCardTransaction.TABLE_NAME + '.id')
            })
            .where(Transaction.TABLE_NAME + '.type', '=', 'cb_payment')
            .groupBy('merchantId')
            .groupBy('merchantName')
            .having('customersCount', '>=', 2)
    }
}

/*
    Here we are exporting the class we just created, so
    it can be imported inside other files.
*/
module.exports = CreditCardTransaction
