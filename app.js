// importing the modules
const express = require('express');
const upload = require('express-fileupload');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// file upload
app.use(upload());

// setting routes
const excelroute = require('./routes/excelroute');
app.use('/', excelroute);

// listening to server
app.listen(4000, () => console.log("Server is listening on port:4000"));