var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

require('dotenv').config()

// const MONGODB_URI="mongodb+srv://user2345:cloud2345@cluster0.qr6fu.gcp.mongodb.net/ManualAuth?retryWrites=true&w=majority"
// mongodb+srv://user2345:cloud2345@cluster1.qr6fu.gcp.mongodb.net/ManualAuth?retryWrites=true&w=majority
// mongodb+srv://user2345:cloud2345@cluster1.jduc1.mongodb.net/<dbname>?retryWrites=true&w=majority

// mongodb+srv://user2345:cloud2345@cluster0.qr6fu.gcp.mongodb.net/ManualAuth?retryWrites=true&w=majority
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ManualAuth');

var db = mongoose.connection;
db.on('connected',()=>{
  console.log('Mongoose is connected!');
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000');
});
