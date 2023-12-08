// Header.js
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';


const HeaderContainer = styled.div`
  background-color: #ccc;
  padding: 20px;
  text-align: center;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatLink = styled(Link)`
  margin-left: 20px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  color: blue;
`;

const LoginButton = styled.button`
  margin-right: 20px;
  cursor: pointer;
`;

const Header = ({ onLogin }) => {
  const location = useLocation();
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegistrationFormVisible, setIsRegistrationFormVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLoginButtonClick = () => {

    setIsLoginFormVisible(true);
    setIsRegistrationFormVisible(false);
  };

  const handleRegistrationButtonClick = () => {
    setIsRegistrationFormVisible(true);
    setIsLoginFormVisible(false);
  };

  // Функция для обработки успешного входа
  const handleLogin = (username) => {
    
    setIsLoggedIn(true);
    setUsername(username);

    // Вызываем переданную функцию для уведомления родительского компонента об успешном входе
    if (onLogin && typeof onLogin === 'function') {
      console.log('try to vhange bitton to username');
      onLogin(username);
    }
  };

  // Функция для обработки выхода
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
    
    // Дополнительные действия при выходе, если необходимо
  };

  return (
    
    <HeaderContainer>
      <HeaderContent>
        {(location.pathname === '/' || location.pathname.startsWith('/chat')) && (
          <ChatLink to={location.pathname.startsWith('/chat') ? '/' : '/chat'}>
            {location.pathname.startsWith('/chat') ? 'Главная' : 'Чат'}
          </ChatLink>
        )}

        {isLoggedIn ? (
          <div>
            <p>{username}</p>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        ) : (
          <LoginButton onClick={handleLoginButtonClick}>Вход</LoginButton>
        )}
      </HeaderContent>
      <h1>Отдел кадров завода телевизоров</h1>

      <LoginForm isVisible={isLoginFormVisible} onClose={() => setIsLoginFormVisible(false)} onSwitchToRegistration={handleRegistrationButtonClick} onLogin={handleLogin} />
      <RegistrationForm isVisible={isRegistrationFormVisible} onClose={() => setIsRegistrationFormVisible(false)} onSwitchToLogin={handleLoginButtonClick} />
    </HeaderContainer>
    
  );
};

export default Header;