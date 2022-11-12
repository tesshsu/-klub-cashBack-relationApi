/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('credit_card_transaction', table => {
        table.increments('id')
        table.string('merchantId', 50).nullable()
        table.string('merchantCategoryCode', 30).nullable()
        table.string('countryCode', 10).nullable()
        table.string('merchantName', 30).nullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('credit_card_transaction');
};
