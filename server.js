const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./server/config/routes')(app);

const port = 8000;

app.listen(port, () => {
  console.log('listen on port 8000');
});
