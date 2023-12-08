import React, { useState } from 'react';
import styled from '@emotion/styled';
import { login } from './api';
import Table from './Table';

const FormContainer = styled.div`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;
localStorage.clear();
const LoginForm = ({ isVisible, onClose, onSwitchToRegistration, onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Отправка данных на сервер для входа
      login(username, password);
      
      // Закрываем форму после успешного входа
      onClose();
      
      if (onLogin && typeof onLogin === 'function') {
        onLogin(username);
        forceUpdate();

      }
    } catch (error) {
      if (error.response) {
        // Если ответ от сервера получен, но не 2xx, обрабатываем ошибку
        console.error('Login error:', error.response.data.message);
      } else {
        // Если ответ от сервера не получен вообще, например, из-за сбоя сети
        console.error('Network error:', error.message);
      }
      console.error('Full error object:', error); // Добавим эту строку
    }

  
  };

  const remakeTable = () => {
    return <Table forceUpdate={forceUpdate} />
  }

  return (
    <FormContainer isVisible={isVisible}>
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" onClick={remakeTable}>Login</button>
      </form>
      <p>
        Нет аккаунта?{' '}
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={onSwitchToRegistration}>
          Регистрация
        </span>
      </p>
    </FormContainer>
  );
};

export default LoginForm;