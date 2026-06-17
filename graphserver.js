const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// Security headers
app.use(helmet());

// CORS — restrict origins in production
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:4000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parsers
app.use(express.json());
const parseForm = express.urlencoded({ extended: false });
app.use(parseForm);
app.use(cookieParser());

// Rate limiting on all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Session — secret from env, never hardcoded
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn(
    'WARNING: SESSION_SECRET is not set. Using an insecure default. ' +
    'Set SESSION_SECRET in your environment before deploying to production.'
  );
}
const sessionConfig = {
  secret: sessionSecret || 'change-me-before-production',
  name: 'graphy',
  resave: false,
  saveUninitialized: false,
  // Use a persistent store (e.g. connect-redis) in production
  cookie: {
    sameSite: 'strict',
    httpOnly: true,
    secure: isProduction,
  },
};
app.use(session(sessionConfig));

// CSRF protection
const csrfProtect = csrf({ cookie: true });
app.get('/form', csrfProtect, function (req, res) {
  res.render('send', { csrfToken: req.csrfToken() });
});
app.post('/posts/create', csrfProtect, function (req, res) {
  res.send('data is being processed');
});

const { URLSearchParams } = require('url');
global.URLSearchParams = URLSearchParams;

let rawdata = fs.readFileSync('UScities.json');
let USCities = JSON.parse(rawdata);

// GraphQL schema
let schema = buildSchema(`
    type Query {
        city(name: String): City
        cities(state: String): [City]
    },
    type City {
        city: String
        state: String
    }
`);

let getCity = function (args) {
  let name = args.name;
  return USCities.filter(city => {
    return city.city == name;
  })[0];
};

let getCities = function (args) {
  if (args.state) {
    let state = args.state;
    return USCities.filter(city => city.state === state);
  } else {
    return USCities;
  }
};

var root = {
  city: getCity,
  cities: getCities,
};

// GraphQL endpoint — disable GraphiQL in production
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: !isProduction,
}));

app.get('/', (req, res) => {
  res.send('Copy the URL from the address-bar, to paste in Postman to use GraphQL');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Express GraphQL Server Now Running On port ${port}/graphql`));
