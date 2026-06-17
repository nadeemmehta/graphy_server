const helmet = require('helmet');
const csrf = require('csurf');
const session = require('express-session');

const csrfProtect = csrf({ cookie: true });

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
  app.use(helmet());
  app.use(session(createSessionConfig(store)));
}

module.exports = { applySecurityMiddleware, csrfProtect };
