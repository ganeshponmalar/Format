const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const url = 'mongodb://localhost:27017/jsonBook';
const port = 8000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on('open', () => {
  console.log('Connected to MongoDB');
});

const formatRouter = require('./routers/formats');
app.use('/formats', formatRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
