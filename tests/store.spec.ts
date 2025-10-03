import { test, expect } from '@playwright/test';

const ORDER_ID = 123456;
const PET_ID = 12345;

test.describe('Store API', () => {
  let orderId: number;

  test('should place an order for a pet', async ({ request }) => {
    const response = await request.post('/v2/store/order', {
      data: {
        id: ORDER_ID,
        petId: PET_ID,
        quantity: 1,
        shipDate: new Date().toISOString(),
        status: 'placed',
        complete: true,
      },
    });
    expect(response.status()).toBe(200);
    const order = await response.json();
    expect(order.id).toBe(ORDER_ID);
    expect(order.petId).toBe(PET_ID);
    orderId = order.id;
  });

  test('should find purchase order by ID', async ({ request }) => {
    const response = await request.get(`/v2/store/order/${orderId}`);
    expect(response.status()).toBe(200);
    const order = await response.json();
    expect(order.id).toBe(orderId);
  });

  test('should return pet inventories by status', async ({ request }) => {
    const response = await request.get('/v2/store/inventory');
    expect(response.status()).toBe(200);
    const inventory = await response.json();
    expect(inventory).toBeDefined();
    expect(typeof inventory.sold).toBe('number');
    expect(typeof inventory.available).toBe('number');
    expect(typeof inventory.pending).toBe('number');
  });

  test('should delete a purchase order by ID', async ({ request }) => {
    const response = await request.delete(`/v2/store/order/${orderId}`);
    expect(response.status()).toBe(200);

    // Verify the order is deleted
    const getResponse = await request.get(`/v2/store/order/${orderId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 400 for placing an invalid order', async ({ request }) => {
    const response = await request.post('/v2/store/order', {
      data: {
        // Invalid data without required fields
      },
    });
    expect(response.status()).toBe(400);
  });

  test('should return 404 for a non-existent order', async ({ request }) => {
    const nonExistentOrderId = 99999999;
    const response = await request.get(`/v2/store/order/${nonExistentOrderId}`);
    expect(response.status()).toBe(404);
  });

  test('should return 400 for an invalid order ID', async ({ request }) => {
    const invalidOrderId = 'invalid-id';
    const response = await request.get(`/v2/store/order/${invalidOrderId}`);
    expect(response.status()).toBe(400);
  });

  test('should return 404 for deleting a non-existent order', async ({ request }) => {
    const nonExistentOrderId = 99999999;
    const response = await request.delete(`/v2/store/order/${nonExistentOrderId}`);
    expect(response.status()).toBe(404);
  });
});