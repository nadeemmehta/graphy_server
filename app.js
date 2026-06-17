const { graphqlHTTP } = require('express-graphql');
const express = require('express');
const schema = require('./schema');
const { loadCities, getCity, getCities } = require('./resolvers');

function createApp(citiesFilePath) {
    const app = express();
    const USCities = loadCities(citiesFilePath);

    const root = {
        city: (args) => getCity(USCities, args),
        cities: (args) => getCities(USCities, args)
    };

    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    }));

    app.get('/', (req, res) => {
        res.send("Copy the URL from the address-bar, to paste in Postman to use GrpahQL");
    });

    return app;
}

module.exports = createApp;
