/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// for synchronus function error handling

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message); // safety net
  console.log(' uncaught exception ');
  process.exit(1);
});
//-------------------------------------------------

dotenv.config({ path: './config.env' });
// eslint-disable-next-line import/extensions
const app = require('./app.js');
// databse connection url
// eslint-disable-next-line no-unused-vars
const DB = process.env.DATABASE.replace(
  // to connect with hosted database
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// const DB_local = process.env.DATABASE_LOCAL;    //to connect to local database

//database is connecting here
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('🌟 🅓 🅐 🅣 🅐 🅑 🅐 🅢 🅔   🅒 🅞 🅝 🅝 🅔 🅒 🅣 🅔 🅓 🌟 \n');
  });
//----------------------------------------------------------------------

//----------------------------------------------------------
const port = process.env.PORT;
const server = app.listen(port, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`app running on port ${port} .....`);
});

// asynchrnous function error
process.on('unhandledRejection', (err) => {
  console.log('🔴🔴 Server is not connected 🔴🔴');
  console.log(err.name, err.message); // safety net
  console.log('UNHANDEL REJECTION ');
  console.log(err)
  server.close(() => {
    process.exit(1);
  });
});
