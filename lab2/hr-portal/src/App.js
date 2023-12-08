import './App.css';
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Table from './components/Table';
import Dropdown from './components/Dropdown';
import Chat from './components/Chat';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

const AppContainer = styled.div`
  text-align: center;
`;

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

function App() {
  const [data, setData] = useState([]);
  const [, forceUpdate] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  
  const updateTable = () => {
    setData([...data]);
    console.log('Table has been updated.');
  }

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    updateTable();
    console.log('User successfully logged in:', username);
    // Ваши дополнительные действия при входе
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    updateTable();
    // ... остальной код обработки выхода
  };

  return (
    <Router>
    <AppContainer>
      <HeaderContainer>
        <Header onLogin={handleLogin} onLogout={handleLogout} updateTable={updateTable} />
      </HeaderContainer>

      <Routes>
        <Route path="/" element={<React.Fragment>
          <Dropdown />
          <Table forceUpdate={forceUpdate} data={data} isLoggedIn={isLoggedIn}/>
        </React.Fragment>} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AppContainer>
  </Router>
      
  );
}

const Header = ({onLogin, onLogout, updateTable}) => {

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
      console.log('username is ', username);
      onLogin(username);
      if (updateTable && typeof updateTable === 'function') {
        updateTable();
      }
    }
  };

  // Функция для обработки выхода
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
    // Вызываем переданную функцию для уведомления родительского компонента об успешном выходе
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
      // Вызываем функцию для обновления таблицы, если она передана
      if (updateTable && typeof updateTable === 'function') {
        updateTable();
      }
    }
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





export default App;
