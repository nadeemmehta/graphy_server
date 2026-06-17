const { graphql } = require('graphql');
const schema = require('../schema');

describe('GraphQL Schema', () => {
    it('should be a valid GraphQL schema', () => {
        expect(schema).toBeDefined();
        expect(schema.getQueryType()).toBeDefined();
    });

    it('should have a city query that accepts a name argument', () => {
        const queryType = schema.getQueryType();
        const fields = queryType.getFields();
        expect(fields.city).toBeDefined();
        expect(fields.city.args.find(a => a.name === 'name')).toBeDefined();
    });

    it('should have a cities query that accepts a state argument', () => {
        const queryType = schema.getQueryType();
        const fields = queryType.getFields();
        expect(fields.cities).toBeDefined();
        expect(fields.cities.args.find(a => a.name === 'state')).toBeDefined();
    });

    it('should have City type with city and state fields', () => {
        const typeMap = schema.getTypeMap();
        const cityType = typeMap.City;
        expect(cityType).toBeDefined();
        const cityFields = cityType.getFields();
        expect(cityFields.city).toBeDefined();
        expect(cityFields.state).toBeDefined();
    });

    it('should execute a city query with resolver', async () => {
        const root = {
            city: () => ({ city: 'TestCity', state: 'TestState' })
        };
        const result = await graphql({
            schema,
            source: '{ city(name: "TestCity") { city state } }',
            rootValue: root
        });
        expect(result.errors).toBeUndefined();
        expect(result.data.city).toEqual({ city: 'TestCity', state: 'TestState' });
    });

    it('should execute a cities query with resolver', async () => {
        const root = {
            cities: () => [
                { city: 'CityA', state: 'StateA' },
                { city: 'CityB', state: 'StateA' }
            ]
        };
        const result = await graphql({
            schema,
            source: '{ cities(state: "StateA") { city state } }',
            rootValue: root
        });
        expect(result.errors).toBeUndefined();
        expect(result.data.cities).toHaveLength(2);
    });
});
