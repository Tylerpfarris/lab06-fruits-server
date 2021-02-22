require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });


    test('returns fruit dependent of the category', async() => {

      const expectation = [
        {
          'id': 1,
          'name': 'Kiwi',
          'flavor': 'Kiwis are sweet, refreshing fruits with a nice tartness that complements their sweetness. The riper the fruit is, the sweeter and less tart it tends to be.',
          'color': 'brown skin with green flesh.',
          'price': '3',
          'grown_in': 'China, Italy and New Zealand',
          'looks_weird': false,
          'category': 'sweet',
          'owner_id': 1
        },
        {
          'id': 2,
          'name': 'Mango',
          'flavor': 'Besides tasting sweet, they have a range of tastes from floral to citrusy depending on the mango. Some have a tropical flower flavor and aroma while others are almost orangy and fairly tart like lemon.',
          'color': 'green, orange and red skin- with saffron colored flesh.',
          'price': '5',
          'grown_in': 'India, China and Thailand',
          'looks_weird': false,
          'category': 'sweet',
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/fruits/categories/sweet')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns a single fruit dependent of the id', async() => {

      const expectation = 
       
        {
          'id': 3,
          'name': 'Starfruit',
          'flavor': 'Star fruit tastes tart and sweet. It’s best described as a cross between a pear, apple, plum, with a hint of citrus added. Unripe star fruits are more on the sour, citrus side while very ripe ones resemble plums and pineapple.',
          'color': 'yellow to green skin- with pale yellow flesh',
          'price': '7',
          'grown_in': 'Malaysia, Philippines and India',
          'looks_weird': true,
          'category': 'tart',
          'owner_id': 1
        };

      const data = await fakeRequest(app)
        .get('/fruits/3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });




    test('returns fruits', async() => {

      const expectation = [
        {
          'id': 1,
          'name': 'Kiwi',
          'flavor': 'Kiwis are sweet, refreshing fruits with a nice tartness that complements their sweetness. The riper the fruit is, the sweeter and less tart it tends to be.',
          'color': 'brown skin with green flesh.',
          'price': '3',
          'grown_in': 'China, Italy and New Zealand',
          'looks_weird': false,
          'category': 'sweet',
          'owner_id': 1
        },
        {
          'id': 2,
          'name': 'Mango',
          'flavor': 'Besides tasting sweet, they have a range of tastes from floral to citrusy depending on the mango. Some have a tropical flower flavor and aroma while others are almost orangy and fairly tart like lemon.',
          'color': 'green, orange and red skin- with saffron colored flesh.',
          'price': '5',
          'grown_in': 'India, China and Thailand',
          'looks_weird': false,
          'category': 'sweet',
          'owner_id': 1
        },
        {
          'id': 3,
          'name': 'Starfruit',
          'flavor': 'Star fruit tastes tart and sweet. It’s best described as a cross between a pear, apple, plum, with a hint of citrus added. Unripe star fruits are more on the sour, citrus side while very ripe ones resemble plums and pineapple.',
          'color': 'yellow to green skin- with pale yellow flesh',
          'price': '7',
          'grown_in': 'Malaysia, Philippines and India',
          'looks_weird': true,
          'category': 'tart',
          'owner_id': 1
        },
        {
          'id': 4,
          'name': 'Passion Fruit',
          'flavor': 'Passion fruit have a fragrantly sweet taste with a pleasantly tart tang and are very juicy. What to akin it to? I don’t know. Let’s see. Maybe kiwi. Maybe pineapple.',
          'color': 'purple to yellow kin- with golden flesh and dark seeds.',
          'price': '8',
          'grown_in': 'Malaysia, United States and Kenya',
          'looks_weird': false,
          'category': 'floral',
          'owner_id': 1
        },
        {
          'id': 5,
          'name': 'Guava',
          'flavor': 'The general taste of guava is said to be a cross between strawberries and pears, but depending on the variety, the sweet flavor will vary between mild and strong',
          'color': 'green, yellow, pink to red skin- with yellow, pink to red flesh',
          'price': '8.5',
          'grown_in': 'India, China and Thailand',
          'looks_weird': false,
          'category': 'floral',
          'owner_id': 1
        },
        {
          'id': 6,
          'name': 'Lychee',
          'flavor': 'Lychee tastes like a grape, but with a stronger, slightly acidic touch. Some people also swear that it tastes more like a pear or a watermelon. It\'s a balance of sweet and tart.',
          'color': 'red or pink skin, and is covered with small wrinkled protuberances, resembling the strawberry tree fruit. The pulp is white, firm and somewhat hard, carrying a seed inside.',
          'price': '6',
          'grown_in': 'Taiwan, China and Thailand',
          'looks_weird': true,
          'category': 'floral',
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/fruits')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('updates a fruit', async() => {

      const newFruit = {
        'name': 'Lychee',
        'flavor': 'Lychee tastes like a grape, but with a stronger, slightly acidic touch. Some people also swear that it tastes more like a pear or a watermelon. It\'s a balance of sweet and tart.',
        'color': 'red or pink skin, and is covered with small wrinkled protuberances, resembling the strawberry tree fruit. The pulp is white, firm and somewhat hard, carrying a seed inside.',
        'price': '12',
        'grown_in': 'Taiwan, China and Thailand',
        'looks_weird': true,
        'category': 'floral',
      };
      
      const expectedFruit = {
        ...newFruit,
        owner_id: 1,
        id: 6
      };

      await fakeRequest(app)
        .put('/fruits/6')
        .send(newFruit)
        .expect('Content-Type', /json/)
        .expect(200);
      
      const updateFruit = await fakeRequest(app)
        .get('/fruits/6')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(updateFruit.body).toEqual(expectedFruit);
    });

    test('deletes a single fruit dependent of the id', async() => {

      const expectation = {
        'id': 3,
        'name': 'Starfruit',
        'flavor': 'Star fruit tastes tart and sweet. It’s best described as a cross between a pear, apple, plum, with a hint of citrus added. Unripe star fruits are more on the sour, citrus side while very ripe ones resemble plums and pineapple.',
        'color': 'yellow to green skin- with pale yellow flesh',
        'price': '7',
        'grown_in': 'Malaysia, Philippines and India',
        'looks_weird': true,
        'category': 'tart',
        'owner_id': 1
      };

      const data = await fakeRequest(app)
        .delete('/fruits/3')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
      
      const deleted = await fakeRequest(app)
        .get('/fruits/3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(deleted.body).toEqual('');
    });
    
    test('creates a new fruit and the new fruit is in our fruits list', async() => {

      const newFruit = {
        'name': 'orange',
        'flavor': 'tastes citrusy-- like an orange',
        'color': 'orange',
        'price': '1',
        'grown_in': 'florida',
        'looks_weird': false,
        'category': 'tart',
      };
      
      const expectedFruit = {
        ...newFruit,
        owner_id: 1,
        id: 7
      };

      const data = await fakeRequest(app)
        .post('/fruits')
        .send(newFruit)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectedFruit);

      const allFruits = await fakeRequest(app)
        .get('/fruits')
        .expect('Content-Type', /json/)
        .expect(200);
      
      const orange = allFruits.body.find(fruit => fruit.name === 'orange');

      expect(orange).toEqual(expectedFruit);
    });
  });
});
