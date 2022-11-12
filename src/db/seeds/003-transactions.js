const bcrypt = require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('sepaTransfers').del()
  await knex('transactions').del()
  await knex('credit_card_transaction').del()

  let user =  await knex('users').where({'email': 'kevin@domain.com'}).first();

  // Transaction 1
  let id = await knex('credit_card_transaction').insert(
      {merchantId: '1', merchantName: 'Francaise de Jeux', merchantCategoryCode: 'Gambling', countryCode: 'FR'  },
  );
  await knex('transactions').insert(
    {type: 'cb_payment', transaction_id: id, amount: -5200, currency: 'EUR', description:'Transaction CB 1', account_id: user.id  },
  );

  // Transaction 2
  id = await knex('credit_card_transaction').insert(
      {merchantId: '2', merchantName: 'Fnac', merchantCategoryCode: 'Book', countryCode: 'FR'  },
  );
  await knex('transactions').insert(
    {type: 'cb_payment', transaction_id: id, amount: -10000, currency: 'EUR', description:'Transaction CB 2', account_id: user.id  },
  );



  user =  await knex('users').where({'email': 'joana@domain.com'}).first();

  // Transaction 3
  id = await knex('credit_card_transaction').insert(
      {merchantId: '2', merchantName: 'Fnac', merchantCategoryCode: 'Book', countryCode: 'FR'  },
  );
  await knex('transactions').insert(
      {type: 'cb_payment', transaction_id: id, amount: -52, currency: 'EUR', description:'Transaction CB 2', account_id: user.id  },
  );

  // Transaction 4
  id = await knex('sepaTransfers').insert(
    {expeditor_name: 'Francaise de Jeux' },
  );
  await knex('transactions').insert(
    {type: 'sepa_transfer', transaction_id: id, amount: -1000, currency: 'EUR', description:'Transaction 2', account_id: user.id   },
  );


};
