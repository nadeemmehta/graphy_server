const { graphqlHTTP } = require('express-graphql');
const express = require('express');

const { citySchema } = require('./schema/citySchema');
const { getCity, getCities } = require('./resolvers/cityResolvers');

const { URLSearchParams } = require('url');
global.URLSearchParams = URLSearchParams;

const app = express();

// Security middleware (helmet, session, CSRF) is available in
// middleware/security.js — uncomment below once a session store is configured:
//
// const { applySecurityMiddleware, csrfProtect } = require('./middleware/security');
// applySecurityMiddleware(app, store);
//
// app.get('/form', csrfProtect, function (req, res) {
//   res.render('send', { csrfToken: req.csrfToken() });
// });
// app.post('/posts/create', express.urlencoded({ extended: false }), csrfProtect, function (req, res) {
//   res.send('data is being processed');
// });

const root = {
  city: getCity,
  cities: getCities,
};

app.use('/graphql', graphqlHTTP({
  schema: citySchema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', (req, res) => {
  res.send('Copy the URL from the address-bar, to paste in Postman to use GraphQL');
});

app.listen(4000, () => console.log('Express GraphQL Server Now Running On port 4000/graphql'));
