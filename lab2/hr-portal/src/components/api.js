import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchData = async () => {
  try {
    var response = await api.get('/');
    response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const addRecord = async (recordData) => {
  console.log('Trying to add record:', recordData);
  try {
    const token = localStorage.getItem('token');
    await api.post('/', recordData, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
    console.log('Record added successfully');
  } catch (error) {
    console.error('Error adding record:', error);
    throw error;
  }
};

const updateRecord = async (id, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    await api.put('/', { id, ...updatedData }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Record updated successfully');
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
};

const deleteRecord = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete('/', { headers: { Authorization: `Bearer ${token}` }, data: { id } });
    console.log('Record deleted successfully');
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
};

const registrarion = async (username, password) => {
  try {
    // Отправка данных на сервер для регистрации
    const response = await api.post('/register/', {
      username,
      password,
    });

    // Обработка успешного ответа, например, сохранение токена
    console.log('Registration successful:', response.data.token);
    
  } catch (error) {
    // Обработка ошибок регистрации
    console.error('Registration error:', error.response.data.message);
  }
};

const login = async (username, password) => {
  const response = await api.post('/login/', {
    username,
    password,
  });

  // Обработка успешного ответа, например, сохранение токена
  console.log('Login successful:', response.data.token);
  localStorage.setItem('token', response.data.token);
}

export { fetchData, addRecord, updateRecord, deleteRecord, registrarion, login };
