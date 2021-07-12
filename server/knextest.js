const knex = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './server/data.db',
  },
});


async function createTable(){
  try {
    await knex.schema
      .createTable('initiateTransferToCosmos', table => { // ethereum event
        table.increments('id');
        table.string('amount');
        table.string('cosmosAddress');
        table.string('status');
        table.index(['amount','cosmosAddress','status']);
      })
      .createTable('unlockOnEthereum', table => { // ethereum event
        table.increments('id');
        table.string('digest');
        table.string('status');
        table.integer('initiateTransferToCosmos_id')
          .unsigned() // has_many initiateTransferToCosmos's
          .references('initiateTransferToCosmos.id');
        table.index(['digest','status', 'InitiateTransferToCosmos_id']);
      })
      // Cosmos events
      .createTable('initiateTransferToEthereum', table => { // cosmos event
        table.increments('id');
        table.string('amount');
        table.string('ethereumAddress');
        table.integer('status'); //a UOE has_many ITTCs
        table.index(['amount','ethereumAddress','status']);
      })
      .createTable('unlockOnCosmos', table => { // cosmos event
        table.increments('id');
        table.string('digest');
        table.string('status');
        table.integer('initiateTransferToEthereum_id')
          .unsigned()
          .references('initiateTransferToEthereum.id'); // has_many initiateTransferToEthereum's
        table.index(['digest','status', 'InitiateTransferToCosmos_id']);
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

createTable()