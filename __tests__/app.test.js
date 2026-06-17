const request = require('supertest');
const path = require('path');
const createApp = require('../app');

describe('Express GraphQL App', () => {
    let app;

    beforeAll(() => {
        app = createApp(path.join(__dirname, '..', 'UScities.json'));
    });

    describe('GET /', () => {
        it('should return instructions text', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.text).toContain('Postman');
        });
    });

    describe('GET /graphql', () => {
        it('should serve GraphiQL interface', async () => {
            const res = await request(app)
                .get('/graphql')
                .set('Accept', 'text/html');
            expect(res.status).toBe(200);
        });
    });

    describe('POST /graphql - city query', () => {
        it('should return a city by name', async () => {
            const query = '{ city(name: "Abilene") { city state } }';
            const res = await request(app)
                .post('/graphql')
                .send({ query })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.city.city).toBe('Abilene');
            expect(res.body.data.city.state).toBeDefined();
        });

        it('should return null for non-existent city', async () => {
            const query = '{ city(name: "FakeCity999") { city state } }';
            const res = await request(app)
                .post('/graphql')
                .send({ query })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.city).toBeNull();
        });
    });

    describe('POST /graphql - cities query', () => {
        it('should return all cities for a given state', async () => {
            const query = '{ cities(state: "Texas") { city state } }';
            const res = await request(app)
                .post('/graphql')
                .send({ query })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.cities.length).toBeGreaterThan(0);
            res.body.data.cities.forEach(city => {
                expect(city.state).toBe('Texas');
            });
        });

        it('should return all cities when no state is provided', async () => {
            const query = '{ cities { city state } }';
            const res = await request(app)
                .post('/graphql')
                .send({ query })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.cities.length).toBeGreaterThan(100);
        });

        it('should return empty array for non-existent state', async () => {
            const query = '{ cities(state: "FakeState") { city state } }';
            const res = await request(app)
                .post('/graphql')
                .send({ query })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.data.cities).toEqual([]);
        });
    });

    describe('POST /graphql - error handling', () => {
        it('should return errors for invalid query', async () => {
            const query = '{ invalidField }';
            const res = await request(app)
                .post('/graphql')
                .send({ query })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });
    });
});
