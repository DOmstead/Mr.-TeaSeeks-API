const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const TeaClippingsService = require('./teaclippings-service');
const { teaClippingValidator } = require('./teaclipping-validation');

const teaClippingsRouter = express.Router();
const bodyParser = express.json();


//XSS is a core step in security for Mr. TeaSeeks. By sanitizing user input we can help ensure malevolent code doesn't make it past our defenses.
const serializeTeaClipping = teaclipping => ({
  id: teaclipping.id,
  name: xss(teaclipping.name),
  tea_type: xss(teaclipping.tea_type),
  caffeine: xss(teaclipping.caffeine),
  taste: xss(teaclipping.taste),
  details: xss(teaclipping.details),
  temp: xss(teaclipping.temp),
  brew_time: xss(teaclipping.brew_time),
  image: xss(teaclipping.image),
});


//Express Router allows us to setup different endpoints so that requests can be handled differently 
//based on where those requests are routed. This is one of two main Routers used by Mr. TeaSeeks. 
teaClippingsRouter
  .route('/api/teaclippings')

//This section deals with GET requests sent to the route above. It is responsible for mapping through all 
//tea clippings in our archive and then responding with the relevant data.  
  .get((req, res, next) => {
    TeaClippingsService.getAllTeaClippings(req.app.get('db'))
      .then(clipping => {
        res.json(clipping.map(serializeTeaClipping));
      })
      .catch(next);
  })

//This section deals with POST requests sent to this route. It ensures that new potential clippings have 
//what it takes to join our archives, specifically ensuring they have all the relevant values, and then 
//responds based off what is contained in the new potential clipping.  
  .post(bodyParser, (req, res, next) => {
    const { name, tea_type, caffeine, taste, details, temp, brew_time, image } = req.body;
    const newTeaClipping = { name, tea_type, caffeine, taste, details, temp, brew_time, image };

    for (const field of ['name', 'tea_type', 'caffeine', 'taste']) {
      if (!newTeaClipping[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = teaClippingValidator(newTeaClipping);
    if (error) return res.status(400).send(error);
    TeaClippingsService.insertTeaClipping(
      req.app.get('db'),
      newTeaClipping
    )
      .then(clipping => {
        logger.info(`New tea clipping was created. ${clipping.name} was created with ID ${clipping.id}.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${clipping.id}`))
          .json(serializeTeaClipping(clipping));
      })
      .catch(next);
  });

//This is the second of two Express Routers utilized by Mr. TeaSeeks. It handles all CRUD requests made 
//for a specific clipping. A user may need to use these endpoints when a record needs to be updated, 
//removed, or read.
teaClippingsRouter
  .route('/api/teaclippings/:teaclipping_id')
  

//This section runs before all other requests to this route. It is in charge of ensuring the requested 
//clipping is one that is currently in our archive. If the relevant clipping cannot be found it responds 
//accordingly. If a clipping is located then the request is allowed to proceed through the rest of this 
//route depending on the CRUD method that was used to make the request. 
  .all((req, res, next) => {
    const { teaclipping_id } = req.params;
    TeaClippingsService.getById(req.app.get('db'), teaclipping_id)
      .then(clipping => {
        if (!clipping) {
          logger.error(`Request recieved with ID ${teaclipping_id}. ID ${teaclipping_id} is not valid.`);
          return res.status(404).json({
            error: { message: `A tea clipping with ID ${teaclipping_id} cannot be found. Please check your tea clipplings ID and try again` }
          });
        }
        res.clipping = clipping;
        next();
      })
      .catch(next);
  })

//If the clipping was found to exist and a GET request was made this endpoint will run. It responds with 
//the tea clipping that was requested. 
  .get((req, res) => {
    res.json(serializeTeaClipping(res.clipping));
  })


//If a tea clipping in our archive contains incorrect data, such a Pu-Erh being accidentally categorized as 
//an Oolong, it will need to be updated to contain the correct information. This endpoint handles PATCH 
//requests and will do just that. 
  .patch(bodyParser, (req, res, next) => {
    const { name, tea_type, caffeine, taste, details, temp, brew_time, image } = req.body;
    const teaClippingToUpdate = { name, tea_type, caffeine, taste, details, temp, brew_time, image };

    const numberOfValues = Object.values(teaClippingToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Values provided matched all values present for this tea clipping.`)
      return res.status(400).json({
        error: {
          message: `No changes were detected. To update a tea clipping please provide an updated value for Name, Tea Type, Caffeine Level, Taste, Details, Brewing Tempature, or Brew Time.`
        }
      });
    }

    const error = teaClippingValidator(teaClippingToUpdate);
    if (error) return res.status(400).send(error);
    
    TeaClippingsService.updateTeaClipping(
      req.app.get('db'),
      req.params.teaclipping_id,
      teaClippingToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })


//Sometimes a tea clipping will need to be deleted, perhaps due to it no longer being available, or 
//because an entry was made incorrectly, or is otherwise inappropriate for our archive. This endpoint 
//allows a tea clipping to be deleted, entirely removing it from our archive. 
  .delete((req, res, next) => {
    const { teaclipping_id } = req.params;
    TeaClippingsService.deleteTeaClipping(
      req.app.get('db'),
      teaclipping_id
    )
      .then(numRowsAffected => {
        logger.info(`Tea clipping entry ${teaclipping_id} was removed.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = teaClippingsRouter;
