const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const customerRoutes = require('./routes/customer')
const employeeRoutes = require('./routes/employee')
const supplierRoutes = require('./routes/supplier')
const organic_compoundRoutes = require('./routes/organicCompound')
const non_organic_compoundRoutes = require('./routes/nonOrganicCompound')
const applianceRoutes = require('./routes/appliance')
const db = require('./database');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/organic_compounds', organic_compoundRoutes);
app.use('/api/non_organic_compounds', non_organic_compoundRoutes);
app.use('/api/appliances', applianceRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
