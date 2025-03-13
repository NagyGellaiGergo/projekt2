// src/lib/api.js
import axios from 'axios';
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }) // Ha van token, hozzáadjuk
  };

  const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('token'); // Ha a token érvénytelen, töröljük
    window.location.href = '/login';
  }

  return response.json();
}

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Laravel backend URL
    headers: {
        'Content-Type': 'application/json',
    },
	const response = await fetch('/api/workouts'); // Ez a kérés a Laravel backendhez kerül
});

export default api;