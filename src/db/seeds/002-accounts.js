
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()
  const kevin =  await knex('users').where({'email': 'kevin@domain.com'}).first();
  const joana =  await knex('users').where({'email': 'joana@domain.com'}).first();

  await knex('accounts').insert([
    {iban: 'IBAN XXXXXXX_Kevin_1', balance: 1500, user_id: kevin.id},
    {iban: 'IBAN XXXXXXX_JASON_2', balance: 36980, user_id: joana.id},
  ]);
};
