import { test, expect } from '@playwright/test';

const PET_ID = 12345;
const PET_NAME = 'JulesPet';
const UPDATED_PET_NAME = 'JulesPet_updated';

test.describe('Pet API', () => {
  let petId: number;

  test('should add a new pet to the store', async ({ request }) => {
    const response = await request.post('/v2/pet', {
      data: {
        id: PET_ID,
        name: PET_NAME,
        status: 'available',
        photoUrls: [],
        tags: [],
      },
    });
    expect(response.status()).toBe(200);
    const pet = await response.json();
    expect(pet.id).toBe(PET_ID);
    expect(pet.name).toBe(PET_NAME);
    petId = pet.id;
  });

  test('should find pet by ID', async ({ request }) => {
    const response = await request.get(`/v2/pet/${petId}`);
    expect(response.status()).toBe(200);
    const pet = await response.json();
    expect(pet.id).toBe(petId);
    expect(pet.name).toBe(PET_NAME);
  });

  test('should update an existing pet', async ({ request }) => {
    const response = await request.put('/v2/pet', {
      data: {
        id: petId,
        name: UPDATED_PET_NAME,
        status: 'sold',
        photoUrls: [],
        tags: [],
      },
    });
    expect(response.status()).toBe(200);
    const pet = await response.json();
    expect(pet.name).toBe(UPDATED_PET_NAME);
    expect(pet.status).toBe('sold');
  });

  test('should find pets by status', async ({ request }) => {
    const response = await request.get('/v2/pet/findByStatus', {
      params: {
        status: 'sold',
      },
    });
    expect(response.status()).toBe(200);
    const pets = await response.json();
    expect(Array.isArray(pets)).toBe(true);
    const pet = pets.find((p: any) => p.id === petId);
    expect(pet).toBeDefined();
    expect(pet.status).toBe('sold');
  });

  test('should update a pet in the store with form data', async ({ request }) => {
    const response = await request.post(`/v2/pet/${petId}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `name=JulesPet_form_updated&status=pending`,
    });
    expect(response.status()).toBe(200);

    // Verify the update
    const getResponse = await request.get(`/v2/pet/${petId}`);
    const pet = await getResponse.json();
    expect(pet.name).toBe('JulesPet_form_updated');
    expect(pet.status).toBe('pending');
  });

  test('should delete a pet', async ({ request }) => {
    const response = await request.delete(`/v2/pet/${petId}`);
    expect(response.status()).toBe(200);

    // Verify the pet is deleted
    const getResponse = await request.get(`/v2/pet/${petId}`);
    expect(getResponse.status()).toBe(404);
  });
});