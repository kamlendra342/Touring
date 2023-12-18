/* eslint-disable import/no-extraneous-dependencies */
const path=require('path')
const express = require('express');
const morgan = require('morgan');
//security inhancer package
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongosanitise = require('express-mongo-sanitize');
const xss = require('xss-clean');
//parameter pollution
const hpp = require('hpp');
const Apperror = require('./utils/apperror');
const GlobalerrHandler = require('./controller/errorcontroler');

const tourrouter = require('./routes/tourroutes');
const userrouter = require('./routes/userroutes');
const reviewrouter = require('./routes/reviewroutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



//Middlewares
//----------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// set security  http header
app.use(helmet());

// to limit the  no of request from user ( used for security)
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'to many request from one IP',
});

app.use('/api', limiter);

// these middleware applied to all te requets
app.use(express.json());

//data sanitization against  Nosql  query injection
app.use(mongosanitise());
//data sanitization against XSS
app.use(xss());
//prevent parameter  pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(express.static(`${__dirname}/public`));
//creating  own middleware it just have another parameter (req,res,next)
app.use((req, res, next) => {
  console.log('here is your own middleware🫡🫡');
  next(); // must in a middleware
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log (req.headers);
  next();
});

//----------------//////////////////////////////
app.get('/', (req, res) => {
  res.status(200).render('base');
})
app.use('/api/v1/review', reviewrouter);
app.use('/api/v1/tours', tourrouter); // tourrouter middleware is called on this specific url;
app.use('/api/v1/users', userrouter);

app.all('*', (req, res, next) => {
  next(new Apperror(`cant find "${req.originalUrl}" on this server`, 404));
});

// global error handling middleware by express
app.use(GlobalerrHandler);

//-----------------------------------------------------------
// SERVER STARTED
module.exports = app;
