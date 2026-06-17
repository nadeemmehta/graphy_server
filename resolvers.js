const fs = require('fs');
const path = require('path');

function loadCities(filePath) {
    const rawdata = fs.readFileSync(filePath || path.join(__dirname, 'UScities.json'));
    return JSON.parse(rawdata);
}

function getCity(cities, args) {
    let name = args.name;
    return cities.filter(city => {
        return city.city == name;
    })[0];
}

function getCities(cities, args) {
    if (args.state) {
        let state = args.state;
        return cities.filter(city => city.state === state);
    } else {
        return cities;
    }
}

module.exports = { loadCities, getCity, getCities };
