const knex = require('knex');
const fixtures = require('./teaClippings-fixtures');
const app = require('../src/app');


//The following tests ensure that the various endpoints work and that their functions run as expected. 

describe('The Mr. TeaSeeks Archive Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnects from the db', () => db.destroy());

  before('cleanup', () => db('teaClippings').truncate());

  afterEach('cleanup', () => db('teaClippings').truncate());

  describe('Illegal request', () => {
    const testTeaClippings = fixtures.makeTeaClippingsArray();

    beforeEach('insert teaClippings', () => {
      return db
        .into('teaClippings')
        .insert(testTeaClippings);
    });

    //Didn't make a valid request with an Auth key. No tea 404 you! :)
    it('responds with 401 Unauthorized for GET /teaClippings', () => {
      return supertest(app)
        .get('/teaClippings')
        .expect(404, { error: 'Unauthorized request' });
    });

    it('responds with 401 Unauthorized for POST /teaClippings', () => {
      return supertest(app)
        .post('/teaClippings')
        .send({ name: 'Strong-Black-Tea', tea_type: 'Black', caffeine: 'Classic', taste: 'Strong' })
        .expect(404, { error: 'Unauthorized request' });
    });

    it('responds with 401 Unauthorized for GET /teaClippings/:id', () => {
      const secondTeaClipping = testTeaClippings[1];
      return supertest(app)
        .get(`/teaClippings/${secondTeaClipping.id}`)
        .expect(401, { error: 'Unauthorized request' });
    });

    it('responds with 401 Unauthorized for DELETE /teaClippings/:id', () => {
      const aTeaClipping = testTeaClippings[1];
      return supertest(app)
        .delete(`/teaClippings/${aTeaClipping.id}`)
        .expect(401, { error: 'Unauthorized request' });
    });
  });

  //This test ensure your tea is crisp and clean. Well, actually it just maes sur eit's what you are expecting. 
  //But with Mr. TeaSeeks that still means it was some really great tea!
  describe('GET /teaClippings', () => {
    context('Given no teaClippings', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/teaClippings')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });

    context('Given there are teaClippings in the database', () => {
      const testTeaClippings = fixtures.makeTeaClippingsArray();

      beforeEach('insert teaClippings', () => {
        return db
          .into('teaClippings')
          .insert(testTeaClippings);
      });

      it('gets the teaClippings from the store', () => {
        return supertest(app)
          .get('/teaClippings')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testTeaClippings);
      });
    });
  });

  //No record? This test sends bakc an error. Found the record? This test shows it works!
  describe('GET /teaClippings/:id', () => {
    context('Given no teaClippings', () => {
      it('responds 404 when teaClipping doesn\'t exist', () => {
        return supertest(app)
          .get('/teaClippings/123')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: 'TeaClipping Not Found' }
          });
      });
    });

    context('Given there are teaClippings in the database', () => {
      const testTeaClippings = fixtures.makeTeaClippingsArray();

      beforeEach('insert teaClippings', () => {
        return db
          .into('teaClippings')
          .insert(testTeaClippings);
      });

      it('responds with 200 and the specified teaClipping', () => {
        const teaClippingId = 2;
        const expectedTeaClipping = testTeaClippings[teaClippingId - 1];
        return supertest(app)
          .get(`/teaClippings/${teaClippingId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedTeaClipping);
      });
    });
  });

  //This DELETE test makes sure delete endpoint works. Or it gives an error.
  describe('DELETE /teaClippings/:id', () => {
    context('Given no teaClippings', () => {
      it('responds 404 whe teaClipping doesn\'t exist', () => {
        return supertest(app)
          .delete('/teaClippings/123')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: 'TeaClipping Not Found' }
          });
      });
    });

    context('Given there are teaClippings in the database', () => {
      const testTeaClippings = fixtures.makeTeaClippingsArray();

      beforeEach('insert teaClippings', () => {
        return db
          .into('teaClippings')
          .insert(testTeaClippings);
      });

      it('removes the teaClipping by ID from the store', () => {
        const idToRemove = 2;
        const expectedTeaClippings = testTeaClippings.filter(bm => bm.id !== idToRemove);
        return supertest(app)
          .delete(`/teaClippings/${idToRemove}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get('/teaClippings')
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedTeaClippings)
          );
      });
    });
  });


  //This POST Tests makes sure post request work, or are tossed out with an error. 
  describe('POST /teaClippings', () => {
    it('responds with 400 missing \'name\' if not supplied', () => {
      const newTeaClippingMissingName = {
        tea_type: 'Black',
        caffeine: 'Classic',
        taste: 'Strong'
      };
      return supertest(app)
        .post('/teaClippings')
        .send(newTeaClippingMissingName)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400, {
          error: { message: '\'name\' is required' }
        });
    });

    it('adds a new teaClipping to the store', () => {
      const newTeaClipping = {
        name: 'test-name',
        tea_type: 'Black',
        caffeine: 'Classic',
        taste: 'Light'
      };
      return supertest(app)
        .post('/teaClippings')
        .send(newTeaClipping)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newTeaClipping.name);
          expect(res.body.tea_type).to.eql(newTeaClipping.tea_type);
          expect(res.body.caffeine).to.eql(newTeaClipping.caffeine);
          expect(res.body.taste).to.eql(newTeaClipping.taste);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/teaClippings/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/teaClippings/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        );
    });
  });
});
