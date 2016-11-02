var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config.js');

var app = module.exports = express();

app.use(session({
  secret: 'supersecret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: config.id,
  clientSecret: config.secret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/auth/me',
  failureRedirect: '/somethingElse'
}));

app.get('/auth/me', function(req, res){
  console.log("this is req.user", req.user);
  res.send(req.user);
});

app.get('/somethingElse', function(req, res){
  console.log('Error');
});


app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
});
