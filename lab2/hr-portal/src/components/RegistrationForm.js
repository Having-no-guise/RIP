import React, { useState } from 'react';
import styled from '@emotion/styled';
import { registrarion } from './api';


const FormContainer = styled.div`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

const RegistrationForm = ({ isVisible, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    registrarion(username, password);
    onClose();
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