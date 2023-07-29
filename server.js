const express = require('express');
const path = require('path');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts'); // Corrected variable name
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'))
 // Corrected the middleware usage
app.get('/', (req, res) => {
    res.render('home');
});

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');



app.listen(PORT, () => {
    console.log(`The server is running on Port No ${PORT}`);
});
