import React, { useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

const FormContainer = styled.div`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

const RegistrationForm = ({ isVisible, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      // Отправка данных на сервер для регистрации
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
      });

      // Обработка успешного ответа, например, сохранение токена
      console.log('Registration successful:', response.data.token);
      onClose();
    } catch (error) {
      // Обработка ошибок регистрации
      console.error('Registration error:', error.response.data.message);
    }
  };

  return (
    <FormContainer isVisible={isVisible}>
      <h2>Registration Form</h2>
      <form onSubmit={handleRegistration}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Уже есть аккаунт?{' '}
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={onSwitchToLogin}>
          Вход
        </span>
      </p>
    </FormContainer>
  );
};

export default RegistrationForm;