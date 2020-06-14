
//This file is one of the most important sections of the Mr. TeaSeeks API, as without this file not much 
//else would function. The services file is used to handle the various CRUD requests that need to be 
//taken care of once a request has been routed correctly. The functions are called using object 
//destructuring throughout the rest of the app, primarily in the Mr. TeaSeeks Router file. 

const TeaClippingsService = {

  //getAllTeaClippings does just what the name would imply! It looks through our archive of tea clippings, 
  //which is all the records in our database, and returns those clippings. 
  getAllTeaClippings(knex) {
    return knex.select('*').from('teaclippings');
  },

  //getByID is another function that does exactly as described. It looks through all the clippings in our 
  //archive and finds the first record where the ID matches the ID parameter provided. 
  getById(knex, id) {
    return knex.from('teaclippings').select('*').where('id', id).first();
  },

  //insertTeaClipping takes a new entry and inserts it into our archive of tea clippings. That new entry it 
  //first routed and verified elsewhere in this app to ensure that only entries that contain all the relevant 
  //data make it to this step. 
  insertTeaClipping(knex, newTeaClipping) {
    return knex
      .insert(newTeaClipping)
      .into('teaclippings')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //By now you have probably already guessed what deleteTeaClipping does, and I bet you’re right! This 
  //function finds a tea clipping that matches the ID provided and permanently removes it from our 
  //archive. 
  deleteTeaClipping(knex, id) {
    return knex('teaclippings')
      .where({ id })
      .delete();
  },
  //updateTeaClipping is called in during a PATCH request. It finds the relevant tea clipping based off ID 
  //and then updates the various field values based off the new values provided. 
  updateTeaClipping(knex, id, newTeaClippingFields) {
    return knex('teaclippings')
      .where({ id })
      .update(newTeaClippingFields);
  },
};

module.exports = TeaClippingsService;
