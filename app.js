var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser')
var jwtMiddleware = require('express-jwt');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var placesRouter = require('./routes/places');
var sessionsRouter = require('./routes/sessions');

const db = require('./config/database');
const secrets = require('./config/secrets');



db.connect();
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    jwtMiddleware({ secret: secrets.jwtSecrets })
    .unless({ path: ['/session', 'users'], method: 'GET' })
)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/places', placesRouter);
app.use('/session', sessionsRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(res.locals.error);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;