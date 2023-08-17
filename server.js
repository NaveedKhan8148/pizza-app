const dotenv = require('dotenv').config()
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('express-flash');
const app = express();
const passport = require('passport')
const PORT = process.env.PORT || 8000;

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
const mongoStore = new MongoDBStore({
  mongooseConnection: connection,
  collection: "session",
});
// session store 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const passportInit = require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next)=>{
  res.locals.session=req.session
  res.locals.user = req.user

  next()
})
// FOR THE ROUTES CONNECTION
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');

// Corrected the middleware usage
require('./routes/web')(app);

app.listen(PORT, () => {
  console.log(`The server is running on Port No ${PORT}`);
});
