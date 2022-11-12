/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('merchants', table => {
        table.increments('id')
        table.string('merchantID', 16)
        table.string('name', 30).notNullable()
        table.binary('logo', 250).nullable()
        table.string('description', 256).nullable()
        table.decimal('cashback', 8, 2).nullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('merchants');
};
