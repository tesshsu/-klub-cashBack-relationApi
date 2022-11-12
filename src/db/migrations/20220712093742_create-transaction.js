/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id')
        table.enu('type', ['transfer', 'payment', 'refund', 'sepa_transfer','cb_payment']).notNullable()
        table.integer('transaction_id').notNullable()
        table.integer('amount').notNullable() // in cents
        table.string('currency', 3).notNullable() // ISO 4217 Currency Codes
        table.string('description', 256).nullable()
        table.integer('account_id').notNullable()
            .references('id')
            .inTable('accounts')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('transactions');
};
