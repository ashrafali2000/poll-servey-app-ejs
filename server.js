

const path = require('path');
const mongoose = require('mongoose');
const configFilePath = path.join('/opt/nil1729/poll-app/backend.env');
require('dotenv').config({ path: configFilePath });

const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const connectDB = require('./config/db');
const passportConfig = require('./config/passport');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Database Connect
// connectDB(process.env.MONGO_URI);
try{
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

}catch(error){
console.log("eerror",error)
}

// Body Parser Setup
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

// Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
});
app.use(limiter);
app.use(cors());

// Session Setup
app.use(
  session({
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
  })
);

// Connect Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Passport Setup
// passportConfig(passport);
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.render('main/index', {
    user: req.user,
  });
});
app.use('/survey', require('./routes/survey'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/user'));

// PORT listen
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
