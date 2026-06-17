const path = require('path');
const { loadCities, getCity, getCities } = require('../resolvers');

describe('resolvers', () => {
    let cities;

    beforeAll(() => {
        cities = loadCities(path.join(__dirname, '..', 'UScities.json'));
    });

    describe('loadCities', () => {
        it('should load cities from file and return an array', () => {
            expect(Array.isArray(cities)).toBe(true);
            expect(cities.length).toBeGreaterThan(0);
        });

        it('should load cities with correct shape (city, state)', () => {
            const first = cities[0];
            expect(first).toHaveProperty('city');
            expect(first).toHaveProperty('state');
        });

        it('should throw when given an invalid file path', () => {
            expect(() => loadCities('/nonexistent/path.json')).toThrow();
        });
    });

    describe('getCity', () => {
        it('should return the first city matching the given name', () => {
            const result = getCity(cities, { name: 'Abilene' });
            expect(result).toBeDefined();
            expect(result.city).toBe('Abilene');
            expect(result.state).toBeDefined();
        });

        it('should return undefined for a non-existent city name', () => {
            const result = getCity(cities, { name: 'NonExistentCity12345' });
            expect(result).toBeUndefined();
        });

        it('should return undefined when name is not provided', () => {
            const result = getCity(cities, {});
            expect(result).toBeUndefined();
        });

        it('should be case-sensitive', () => {
            const result = getCity(cities, { name: 'abilene' });
            expect(result).toBeUndefined();
        });

        it('should return only the first match for cities with duplicate names', () => {
            const result = getCity(cities, { name: 'Aberdeen' });
            expect(result).toBeDefined();
            expect(result.city).toBe('Aberdeen');
            // Aberdeen exists in multiple states; first match should be returned
            expect(result.state).toBe('Maryland');
        });
    });

    describe('getCities', () => {
        it('should return all cities when no state is provided', () => {
            const result = getCities(cities, {});
            expect(result).toEqual(cities);
        });

        it('should filter cities by state', () => {
            const result = getCities(cities, { state: 'Texas' });
            expect(result.length).toBeGreaterThan(0);
            result.forEach(city => {
                expect(city.state).toBe('Texas');
            });
        });

        it('should return an empty array for a non-existent state', () => {
            const result = getCities(cities, { state: 'FakeState' });
            expect(result).toEqual([]);
        });

        it('should be case-sensitive for state filtering', () => {
            const result = getCities(cities, { state: 'texas' });
            expect(result).toEqual([]);
        });

        it('should return all cities when state is undefined', () => {
            const result = getCities(cities, { state: undefined });
            expect(result).toEqual(cities);
        });

        it('should return all cities when state is empty string', () => {
            // empty string is falsy, so should return all cities
            const result = getCities(cities, { state: '' });
            expect(result).toEqual(cities);
        });
    });
});
