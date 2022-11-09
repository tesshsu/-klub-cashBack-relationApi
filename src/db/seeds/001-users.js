const bcrypt = require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {firstName: 'Kevin', lastName: 'Jason', email: 'kevin@domain.com', password: bcrypt.hashSync('xyz', 10)},
    {firstName: 'Joana', lastName: 'wu', email: 'joana@domain.com', password: bcrypt.hashSync('abc', 10)}
  ]);
};
