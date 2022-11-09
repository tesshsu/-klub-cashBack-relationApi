/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('firstName').notNullable()
            table.string('lastName').notNullable()
            table.string('email').notNullable().unique()
            table.text('password').notNullable()
            table.timestamps(true, true)
        })
        .createTable('accounts', table => {
            table.increments('id').primary()
            table.string('iban').notNullable()
            table.integer('balance').notNullable()
            table.timestamps(true, true)
            table.integer('user_id').notNullable()
                .references('id')
                .inTable('users')
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('accounts').dropTableIfExists('users')
};
