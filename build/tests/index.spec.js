import app from '../app';
import request from 'supertest';
describe('GET /api/users', () => {
  test('Debería responder un codigo de estado 200', async () => {
    const response = await request(app).get('/api/users').send();
    expect(response.statusCode).toBe(200);
  });
  test('Debería responder con un array', async () => {
    const response = await request(app).get('/api/users').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});
describe('POST /api/users', () => {
  describe('Dados los datos correctos', () => {
    test('Debería responder un codigo de estado 200', async () => {
      const response = await request(app).post('/api/users').send({
        nombres: "bbbbb",
        apellidos: "apellido",
        ci: "6578965",
        email: "bbb@gmail.com",
        password: "6578965"
      });
      expect(response.statusCode).toBe(201);
    });
    test('Debería tener un content-type: application/json en el encabezado', async () => {
      const response = await request(app).post('/api/users').send();
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    });
    test('Debería tener un id asignado', async () => {
      const response = await request(app).post('/api/users').send({
        nombres: "aaaaa",
        apellidos: "vvvvv",
        ci: "6561651",
        email: "this@gmail.com",
        password: "16515651"
      });
      expect(response.body.id_persona).toBeDefined();
    });
  });
  describe('Cuando los datos estan incompletos', () => {
    test('Debería responder con un código de estado 400', async () => {
      const fields = [{}, {
        apellidos: 'adfdff',
        ci: '915151',
        email: 'dddd@gmail.com',
        password: 'dfklsjfds'
      }, {
        nombres: 'qqqq',
        apellidos: 'adfdff',
        ci: '915151',
        email: 'kkk@gmail.com',
        password: ''
      }];

      for (const body of fields) {
        const response = await request(app).post("/api/users").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});