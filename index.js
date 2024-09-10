const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const customerRoutes = require('./routes/customer')
const db = require('./database');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.use('/api', customerRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
