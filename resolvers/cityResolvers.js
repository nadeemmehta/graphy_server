const { loadJsonSync } = require('../utils/dataLoader');
const { filterByField, findOneByField } = require('../utils/collectionUtils');

const USCities = loadJsonSync('UScities.json');

function getCity(args) {
  return findOneByField(USCities, 'city', args.name);
}

function getCities(args) {
  if (args.state) {
    return filterByField(USCities, 'state', args.state);
  }
  return USCities;
}

module.exports = { getCity, getCities };
