require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')

// Database connection
const url = 'mongodb://127.0.0.1:27017/pizza-real-time-app';

// Ensure the MongoDB connection is established
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("Connected to MongoDB successfully");
});


connection.on('error', (error) => {
  console.error("Error connecting to MongoDB:", error.message);
});

// Initialize the MongoDBStore
const mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "session",
});
// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false, 
    store: mongoStore,
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

// Set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
