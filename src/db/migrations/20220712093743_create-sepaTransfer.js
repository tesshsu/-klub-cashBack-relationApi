/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('sepaTransfers', table => {
        table.increments('id')
        table.string('expeditor_name').notNullable()
        table.integer('transaction_id').notNullable()
            .references('id')
            .inTable('transactions')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('sepaTransfers');
};
