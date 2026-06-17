const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const express = require('express');
const app = express();

// TODO: Install and enable security middleware (helmet, csurf) for production use.
// const helmet = require('helmet');
// const csrf = require('csurf');
// app.use(helmet());

const { URLSearchParams } = require('url');
global.URLSearchParams = URLSearchParams;

let rawdata;
try {
    rawdata = fs.readFileSync('UScities.json');
} catch (err) {
    console.error(`Failed to read UScities.json: ${err.message}`);
    process.exit(1);
}

let USCities;
try {
    USCities = JSON.parse(rawdata);
} catch (err) {
    console.error(`Failed to parse UScities.json: ${err.message}`);
    process.exit(1);
}

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

let getCity = function(args) {
    if (!args.name) {
        throw new Error('A "name" argument is required to look up a city');
    }
    let name = args.name;
    let result = USCities.filter(city => {
        return city.city == name;
    })[0];
    if (!result) {
        throw new Error(`City not found: ${name}`);
    }
    return result;
}

let getCities = function(args) {
    if (args.state) {
        let state = args.state;
        return USCities.filter(city => city.state === state);
    } else {
        return USCities;
    }
}

var root = {
    city: getCity,
    cities: getCities
};

// Create an express server and a GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    customFormatErrorFn: (err) => {
        console.error('GraphQL error:', err.message);
        return { message: err.message, locations: err.locations };
    }
}));

app.get('/', (req, res) => {
    res.send("Copy the URL from the address-bar, to paste in Postman to use GraphQL")
})

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack || err.message);
    res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(4000, () => console.log('Express GraphQL Server Now Running On port 4000/graphql'));
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('Port 4000 is already in use. Please free the port or use a different one.');
    } else {
        console.error(`Failed to start server: ${err.message}`);
    }
    process.exit(1);
});
