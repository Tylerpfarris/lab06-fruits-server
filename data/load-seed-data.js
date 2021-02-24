const client = require('../lib/client');
// import our seed data:
const fruits = require('./fruits.js');
const usersData = require('./users.js');
const categoriesData = require('./categories.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {'';
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    await Promise.all(
      categoriesData.map(category => {
        return client.query(`
                      INSERT INTO categories (name_type)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [category.name_type]);
      })
    );
    
    const user = users[0].rows[0];
  
    await Promise.all(
      fruits.map(fruit => {
        return client.query(`
                    INSERT INTO fruits (name, flavor, color, price, grown_in, looks_weird, category_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [fruit.name,
          fruit.flavor,
          fruit.color,
          fruit.price,
          fruit.grown_in,
          fruit.looks_weird,
          fruit.category_id,
          user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
