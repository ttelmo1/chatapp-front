import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5125/api',
  timeout: 5000,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    } 
});


export default api;
