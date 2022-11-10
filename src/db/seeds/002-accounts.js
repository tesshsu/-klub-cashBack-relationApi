
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()
  await knex('accounts').insert([
    {iban: 'IBAN XXXXXXX_Kevin_1', balance: 1500, user_id: 1},
    {iban: 'IBAN XXXXXXX_JASON_2', balance: 36980, user_id: 2},
  ]);
};
