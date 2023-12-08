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

export { fetchData, addRecord, updateRecord, deleteRecord };
