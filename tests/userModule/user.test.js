/* eslint-disable no-undef */
require('module-alias/register');
const request = require('supertest');
const app = require('../../src/app');
describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const res = await request(app)
            .get('/api/v1/users');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('post');
    });
});