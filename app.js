const express = require('express');
const app = express();
const productRouter = require('./routers/product-router');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./public'));

app.use('/api/v1/products', productRouter);

app.listen(3000, () => {
  console.log('Listening on 3000');
  connectDB(process.env.MONGO_URI);
});
