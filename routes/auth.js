var express = require('express');
var router = express.Router();
var passport = require('passport');

const cookieOpts = {
  maxAge: process.env.EXPIRATION || 86400000,   // in ms
  httpOnly: true,
  secure: true,
};

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', 
  (req,res,next) => {
    // Save the referrer URL to redirect back after authentication...
    req.session.returnTo = req.query.returnTo;
    next();
  },
  passport.authenticate('auth0', {
    scope: 'openid email profile'
  }),
  function (req, res) {
    res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect(process.env.LOGIN_URL || '/login'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }

      // Save JWT to cookie
      // See https://github.com/auth0/passport-auth0/issues/25 for details
      console.log(`Got user token for user:`);
      console.dir(user);

      if(process.env.COOKIE_DOMAIN) {
        cookieOpts.domain = process.env.COOKIE_DOMAIN == '.' ? '.'+req.hostname : process.env.COOKIE_DOMAIN;
      }
      info && info.jwt_token && res.cookie(process.env.COOKIE_NAME || 'jwt_token', info.jwt_token, cookieOpts);

      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || process.env.RETURN_URL || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie(process.env.COOKIE_NAME || 'jwt_token', cookieOpts);
  res.redirect(process.env.LOGOUT_URL || '/');
});

module.exports = router;
