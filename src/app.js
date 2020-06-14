require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validate-bearer-token');
const errorHandler = require('./error-handler');
const teaClippingsRouter = require('./teaclippings/teaclippings-router');


//Welcome to the Mr. TeaSeeks App, or more specifically its central file. Now you might be thinking 
//something like “Mr. TeaSeeks, this sure is a small file for it to be the core of your app. What gives?” 
//Don’t be fooled! Even though it is small it is quite mighty! This file does a lot. It first requires all the 
//middleware and other files we need to run this app. It then makes sure we have a logger setup, that all 
//our middleware is in place, and that we are using our customer Express Router component called 
//teaclippingsRouter. If this file didn’t exist, Mr. TeaSeeks wouldn’t either!

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}));

app.get('/', (req,res,next) => {
  res.send('Welcome to Mr. TeaSeeks');
});

app.use(cors());
app.use(helmet());
app.use(validateBearerToken);
app.use(teaClippingsRouter);
app.use(errorHandler);

module.exports = app;
