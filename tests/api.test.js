const request = require('supertest');
const { app } = require('../server');

describe('calculator API', () => {
  test('reports a healthy API', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'healthy',
      services: { api: { status: 'healthy' } }
    });
  });

  test('evaluates an expression', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ expression: '(12 + 8) / 4' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      expression: '(12 + 8) / 4',
      result: 5,
      executionTimeMs: expect.any(Number)
    });
  });

  test('returns the shared error shape for invalid input', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ expression: '9 / 0' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Cannot divide by zero',
        details: null
      }
    });
  });
});