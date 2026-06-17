const { graphqlHTTP } = require('express-graphql');
const express = require('express');

const { applySecurityMiddleware, csrfProtect } = require('./middleware/security');
const { citySchema } = require('./schema/citySchema');
const { getCity, getCities } = require('./resolvers/cityResolvers');

const { URLSearchParams } = require('url');
global.URLSearchParams = URLSearchParams;

const app = express();

// Uncomment the lines below once a session store is configured:
// applySecurityMiddleware(app, store);

// CSRF-protected routes (require session + store to be configured first)
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
