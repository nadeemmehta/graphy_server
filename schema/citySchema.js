const { buildSchema } = require('graphql');

const citySchema = buildSchema(`
  type Query {
    city(name: String): City
    cities(state: String): [City]
  },
  type City {
    city: String
    state: String
  }
`);

module.exports = { citySchema };
