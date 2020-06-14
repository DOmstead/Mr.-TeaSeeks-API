const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');


//What’s an API without a server? Not much when you think about it. That’s why this file is the most 
//important file in the Mr. TeaSeeks app, apart from the app file itself. Think of them like best friends, 
//and just like a best friend, this server file is listening, so make a request anytime.  

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
