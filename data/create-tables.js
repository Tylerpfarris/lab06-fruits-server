const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();
    console.log('pre qu');
    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY NOT NULL,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                ); 
                CREATE TABLE categories (
                  id SERIAL PRIMARY KEY NOT NULL,
                  name_type VARCHAR(512) NOT NULL 
            );          
                CREATE TABLE fruits (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    flavor VARCHAR(512) NOT NULL,
                    color VARCHAR(512) NOT NULL,
                    price DECIMAL NOT NULL,
                    grown_in VARCHAR(512) NOT NULL,
                    looks_weird BOOLEAN NOT NULL,
                    category_id INTEGER NOT NULL REFERENCES categories(id),
                    owner_id INTEGER NOT NULL REFERENCES users(id)
            );
           
        `);
    console.log('post');
    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
