const { API_TOKEN } = require('./config');
const logger = require('./logger');


//An app that accepts requests from any source without validating those requests better have some 
//serious server power behind it, not to mention some exceptional security measures. To make sure we 
//keep Mr. TeaSeeks and the data it holds secure, all requests against our app are validated to ensure 
//they have a proper authorization key to do so. This keeps bad actors from gaining access to things they 
//shouldn’t.  

function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  console.log(`Testing request to path: ${req.path} with authToken ${authToken}: Should be bearer ${API_TOKEN} `);
  
  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    logger.error(`Unauthorized request to path: ${req.path} with authToken ${authToken}: Should be bearer ${API_TOKEN} `);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
}

module.exports = validateBearerToken;
