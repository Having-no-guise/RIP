import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
//import {socket} from './socket.js';

const ChatContainer = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
`;

const MessageContainer = styled.div`
  margin-top: 10px;
`;

const MessageInput = styled.input`
  margin-top: 10px;
  width: 80%;
`;

const SendMessageButton = styled.button`
  margin-top: 10px;
  width: 20%;
  type="button";
`;

const socket = io('http://localhost:3000/');

socket.on("connect", () => {
  console.log("Socket connection is ",socket.connected); // true
  socket.emit('join room', 'общая_комната');
});

socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
});

const Chat = () => {
  const [user_message, setMessage] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Обработка новых сообщений от сервера
    socket.on('chat message', (msg) => {
      // Обновление состояния с новым сообщением
      setData((prevData) => [...prevData, msg]);
      
    });

    return () => {
      // Отключение от сервера при размонтировании компонента
      //socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    // Отправка сообщения на сервер
    socket.emit('chat message', {room: 'общая_комната', message: user_message});
    console.log('user message is ', user_message);
    // Очистка поля ввода после отправки сообщения
    setMessage('');
  };

  return (
    <ChatContainer>
      <MessageContainer>
        {data.map((msg, index) => (
          <div key={index}>{msg}</div> 
        ))}
      </MessageContainer>
      <MessageInput
        type="text"
        placeholder="Введите сообщение..."
        value={user_message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <SendMessageButton onClick={handleSendMessage}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </SendMessageButton>
    </ChatContainer>
  );
};

export default Chat;