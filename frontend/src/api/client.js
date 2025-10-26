import axios from 'axios';

const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function attachToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export function clearToken() {
  delete api.defaults.headers.common.Authorization;
}

function unwrap(response) {
  if (response.data?.success === false) {
    throw new Error(response.data.message || 'Request failed');
  }
  return response.data;
}

function handleError(error) {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.message) {
    throw new Error(error.message);
  }
  throw new Error('Unexpected error');
}

export async function loginRequest(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
}

export async function registerRequest(payload) {
  try {
    const response = await api.post('/auth/register', payload);
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
}

export async function fetchCurrentUser() {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchStats() {
  try {
    const response = await api.get('/users/stats');
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchWorkouts() {
  try {
    const response = await api.get('/workouts');
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createWorkout(payload) {
  try {
    const response = await api.post('/workouts', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateWorkout(id, payload) {
  try {
    const response = await api.put(`/workouts/${id}`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteWorkout(id) {
  try {
    await api.delete(`/workouts/${id}`);
  } catch (error) {
    handleError(error);
  }
}

export async function fetchMeals() {
  try {
    const response = await api.get('/meals');
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createMeal(payload) {
  try {
    const response = await api.post('/meals', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateMeal(id, payload) {
  try {
    const response = await api.put(`/meals/${id}`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteMeal(id) {
  try {
    await api.delete(`/meals/${id}`);
  } catch (error) {
    handleError(error);
  }
}
