const { NODE_ENV } = require('./config');
const logger = require('./logger');


//This error handler is both a key security piece and a helpful function for debugging. How is that you 
//ask? Great question! While in development we get a detailed error log when an error occurs, allowing
//us to debug any issues. While in production however, any errors simply tell the user there was an 
//error with the server. This denies any bad actors from gaining helpful information about how their 
//malevolent requests were handled. Remember, knowledge is power! So the less we tell hackers the 
//better. 

function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    logger.error(error.message);
    response = { error: { message: 'server error' } };
  } else {
    logger.error(error.message);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
}

module.exports = errorHandler;
