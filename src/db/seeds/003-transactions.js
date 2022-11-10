const bcrypt = require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('sepaTransfers').del()
  await knex('sepaTransfers').insert([
    {expeditor_name: 'Michel Berger' },
    {expeditor_name: 'Francaise de Jeux' },
  ]);

  await knex('cbPayments').del()
  await knex('cbPayments').insert([
    {merchantId: '1', merchantName: 'Francaise de Jeux', merchantCategoryCode: 'Gambling', countryCode: 'FR'  },
    {merchantId: '2', merchantName: 'Fnac', merchantCategoryCode: 'Book', countryCode: 'FR'  },
  ]);

  await knex('transactions').insert([
    {type: 'sepa_transfer', transaction_id: 1, total: 10, description:'Transaction 1', account_id: 1  },
    {type: 'sepa_transfer', transaction_id: 2, total: -10, description:'Transaction 2', account_id: 2  },
    {type: 'cb_payment', transaction_id: 1, total: -100, description:'Transaction CB 1', account_id: 1  },
    {type: 'cb_payment', transaction_id: 2, total: -100, description:'Transaction CB 2', account_id: 2  },
  ]);


};
