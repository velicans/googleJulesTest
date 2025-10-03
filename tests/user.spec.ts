import { test, expect } from '@playwright/test';

const USERNAME = 'jules_user';
const UPDATED_USERNAME = 'jules_user_updated';
const USER_DATA = {
  id: 98765,
  username: USERNAME,
  firstName: 'Jules',
  lastName: 'Test',
  email: 'jules@example.com',
  password: 'password123',
  phone: '123-456-7890',
  userStatus: 1,
};

test.describe('User API', () => {
  test.beforeAll(async ({ request }) => {
    // Clean up user if it exists from a previous run
    await request.delete(`/v2/user/${USERNAME}`).catch(() => {});
    await request.delete(`/v2/user/${UPDATED_USERNAME}`).catch(() => {});
  });

  test('should create a new user', async ({ request }) => {
    const response = await request.post('/v2/user', {
      data: USER_DATA,
    });
    expect(response.status()).toBe(200);
  });

  test('should get user by username', async ({ request }) => {
    const response = await request.get(`/v2/user/${USERNAME}`);
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.username).toBe(USERNAME);
    expect(user.firstName).toBe('Jules');
  });

  test('should log user into the system', async ({ request }) => {
    const response = await request.get('/v2/user/login', {
      params: {
        username: USERNAME,
        password: 'password123',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toContain('logged in user session:');
  });

  test('should log out current user session', async ({ request }) => {
    // First, log in to establish a session
    await request.get('/v2/user/login', {
      params: {
        username: USERNAME,
        password: 'password123',
      },
    });
    // Then log out
    const response = await request.get('/v2/user/logout');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('ok');
  });

  test('should update a user', async ({ request }) => {
    const response = await request.put(`/v2/user/${USERNAME}`, {
      data: { ...USER_DATA, username: UPDATED_USERNAME, email: 'jules_updated@example.com' },
    });
    expect(response.status()).toBe(200);

    // Verify the update
    const getResponse = await request.get(`/v2/user/${UPDATED_USERNAME}`);
    const user = await getResponse.json();
    expect(user.email).toBe('jules_updated@example.com');
  });

  test('should delete a user', async ({ request }) => {
    const response = await request.delete(`/v2/user/${UPDATED_USERNAME}`);
    expect(response.status()).toBe(200);

    // Verify the user is deleted
    const getResponse = await request.get(`/v2/user/${UPDATED_USERNAME}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should create a list of users with array', async ({ request }) => {
    const users = [
      { id: 11, username: 'user11', firstName: 'fn11', lastName: 'ln11', email: 'email11@test.com', password: 'password', phone: '1234567890', userStatus: 1 },
      { id: 12, username: 'user12', firstName: 'fn12', lastName: 'ln12', email: 'email12@test.com', password: 'password', phone: '1234567890', userStatus: 1 }
    ];
    const response = await request.post('/v2/user/createWithArray', {
      data: users
    });
    expect(response.status()).toBe(200);

    // Verify one of the users
    const getResponse = await request.get(`/v2/user/user11`);
    expect(getResponse.status()).toBe(200);
  });

  test('should create a list of users with list', async ({ request }) => {
    const users = [
      { id: 21, username: 'user21', firstName: 'fn21', lastName: 'ln21', email: 'email21@test.com', password: 'password', phone: '1234567890', userStatus: 1 },
      { id: 22, username: 'user22', firstName: 'fn22', lastName: 'ln22', email: 'email22@test.com', password: 'password', phone: '1234567890', userStatus: 1 }
    ];
    const response = await request.post('/v2/user/createWithList', {
      data: users
    });
    expect(response.status()).toBe(200);

    // Verify one of the users
    const getResponse = await request.get(`/v2/user/user21`);
    expect(getResponse.status()).toBe(200);
  });

  test('should return 404 for a non-existent user', async ({ request }) => {
    const nonExistentUsername = 'nonexistentuser';
    const response = await request.get(`/v2/user/${nonExistentUsername}`);
    expect(response.status()).toBe(404);
  });

  test('should return 400 for invalid login', async ({ request }) => {
    const response = await request.get('/v2/user/login', {
      params: {
        username: USERNAME,
        password: 'wrongpassword',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('should return 404 when updating a non-existent user', async ({ request }) => {
    const nonExistentUsername = 'nonexistentuser';
    const response = await request.put(`/v2/user/${nonExistentUsername}`, {
      data: USER_DATA,
    });
    expect(response.status()).toBe(404);
  });

  test('should return 404 when deleting a non-existent user', async ({ request }) => {
    const nonExistentUsername = 'nonexistentuser';
    const response = await request.delete(`/v2/user/${nonExistentUsername}`);
    expect(response.status()).toBe(404);
  });
});