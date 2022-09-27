const mongoose = require('mongoose');

const connectDB = (uri) => {
  return mongoose
    .connect(uri)
    .then(() => {
      console.log('Database Connection Established');
    })
    .catch((err) => console.log(err));
};
module.exports = connectDB;
