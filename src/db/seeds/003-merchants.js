const bcrypt = require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('merchants').del()

  await knex('merchants').insert([
    {merchantId: 'CARREFOUR_ID', name: 'CARREFOUR', logo: 'https://sendeyo.com/show/d028f1abc4', description:'CARREFOUR TPE 1', cashback: 2.5  },
    {merchantId: 'AUCHAN_ID', name: 'AUCHAN', logo: 'https://sendeyo.com/show/d028f1abc4', description:'AUCHAN TPE 1', cashback: 3  },
    {merchantId: '123', name: 'FNAC', logo: 'https://sendeyo.com/show/d028f1abc4', description:'FNAC TPE 1', cashback: 5  },
  ]);
};
