/**
 * Security middleware — helmet, session, and CSRF protection.
 *
 * NOTE: `csurf` is archived upstream. Consider replacing it with a
 * double-submit-cookie or signed-token pattern before enabling in production.
 * These packages are intentionally lazy-required so they don't need to be
 * installed until this module is actually used.
 */

function createSessionConfig(store) {
  return {
    secret: process.env.SESSION_SECRET || 'changeme',
    name: 'graphy',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: 'strict',
    },
  };
}

function applySecurityMiddleware(app, store) {
  const helmet = require('helmet');
  const session = require('express-session');

  app.use(helmet());
  app.use(session(createSessionConfig(store)));
}

function createCsrfProtect() {
  const csrf = require('csurf');
  return csrf({ cookie: true });
}

module.exports = { applySecurityMiddleware, createCsrfProtect };
