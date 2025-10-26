import { config } from './config.js';

async function request(path, options = {}) {
  const token = localStorage.getItem('fittrack_token');
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers
  });
  if (response.status === 204) {
    return null;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getProfile() {
  return request('/users/me', { method: 'GET' });
}

export function getStats() {
  return request('/users/stats', { method: 'GET' });
}

export function listWorkouts() {
  return request('/workouts', { method: 'GET' });
}

export function createWorkout(workout) {
  return request('/workouts', {
    method: 'POST',
    body: JSON.stringify(workout)
  });
}

export function updateWorkout(id, workout) {
  return request(`/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(workout)
  });
}

export function deleteWorkout(id) {
  return request(`/workouts/${id}`, { method: 'DELETE' });
}

export function listMeals() {
  return request('/meals', { method: 'GET' });
}

export function createMeal(meal) {
  return request('/meals', {
    method: 'POST',
    body: JSON.stringify(meal)
  });
}

export function updateMeal(id, meal) {
  return request(`/meals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(meal)
  });
}

export function deleteMeal(id) {
  return request(`/meals/${id}`, { method: 'DELETE' });
}
