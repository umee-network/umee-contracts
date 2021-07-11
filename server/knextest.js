const knex = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data.db',
  },
});


async function dostuff(){
  try {
    // Create a table
    await knex.schema
      .createTable('burnEvents', table => {
        table.increments('id');
        table.string('amount');
        table.string('cosmosAddress');
        table.string('status');

        table.string('transactionHash');
        table.string('blockHash');
        table.string('blockNumber');
        table.index(['amount','cosmosAddress','status']);
      })
      .createTable('burnEvents', table => {
        table.increments('id');
        table.string('amount');
        table.string('cosmosAddress');
        table.string('status');

        table.string('transactionHash');
        table.string('blockHash');
        table.string('blockNumber');
        table.index(['amount','cosmosAddress','status']);
      })
      // ...and another
      .createTable('accounts', table => {
        table.increments('id');
        table.string('account_name');
        table
          .integer('user_id')
          .unsigned()
          .references('users.id');
      })

    // Then query the table...
    const insertedRows = await knex('users').insert({ user_name: 'Timbo' })

    // ...and using the insert id, insert into the other table.
    await knex('accounts').insert({ account_name: 'knex', user_id: insertedRows[0] })

    // Query both of the rows.
    const selectedRows = await knex('users').join('accounts', 'users.id', 'accounts.user_id').select('users.user_name as user', 'accounts.account_name as account')
    knex('users').join('accounts', 'users.id', 'accounts.user_id').select('users.user_name as user', 'accounts.account_name as account').then(console.log)
    // map over the results
    const enrichedRows = selectedRows.map(row => ({ ...row, active: true }))

    // Finally, add a catch statement
  } catch(e) {
    console.error(e);
  };
  console.log("HELLO")
}

dostuff()