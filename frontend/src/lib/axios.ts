// src/lib/axios.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://lab-inventory-fki.test/api',
  headers: {
    Accept: 'application/json',
  },
});

export default api;
