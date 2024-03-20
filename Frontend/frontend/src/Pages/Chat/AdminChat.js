import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import styles from './Chat.module.css';

const AdminChat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isFirstConnection, setIsFirstConnection] = useState(true);
  const [userUsername, setUserUsername] = useState('');
  const { id: userIdFromURL } = useParams();
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  //const [hasReadReceipt, setHasReadReceipt] = useState(false);

  useEffect(() => {

    let typingTimeout;

  const handleTyping = (isTyping) => {
    setIsTyping(isTyping);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

    const connectWebSocket = async () => {
      try {
        const timeout = isFirstConnection ? 100 : 50000;

        await new Promise((resolve) => setTimeout(resolve, timeout));

        const socket = new SockJS('http://localhost:8084/spring-demo/chat');
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
          console.log('Connected to WebSocket:', frame);

          client.subscribe('/topic/messages', async (message) => {
            const parsedMessage = JSON.parse(message.body);

            if (
              parsedMessage.senderId === '98b52895-6fbc-4c83-a3ce-971bf0916868' ||
              parsedMessage.senderId === userIdFromURL
            ) {
              const receivedMessage = parsedMessage.text;
              console.log('Received message:', receivedMessage);

              setChatMessages((prevMessages) => [...prevMessages, parsedMessage]);
            }
          });

          client.subscribe('/topic/typing', (typingStatus) => {
            const parsedTypingStatus = JSON.parse(typingStatus.body);
            if(parsedTypingStatus.userId === userIdFromURL)
            {handleTyping(parsedTypingStatus.typing);}
          });

          // client.subscribe('/topic/read-receipts', (readReceipt) => {
          //   const parsedReadReceipt = JSON.parse(readReceipt.body);
          //   console.log(parsedReadReceipt);
          //   if (parsedReadReceipt.senderId === userIdFromURL) {
          //     setHasReadReceipt(true);
          //   }
          // });

          setStompClient(client);
          setIsFirstConnection(false);
        });
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8082/spring-demo/user/${userIdFromURL}`);
        const userData = await response.json();

        setUserUsername(userData.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
    connectWebSocket();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
        console.log('Disconnected from WebSocket');
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [isFirstConnection, stompClient, userIdFromURL]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '' && stompClient) {
      const message = {
        text: inputMessage,
        senderId: '98b52895-6fbc-4c83-a3ce-971bf0916868',
      };

      stompClient.send('/app/sendMessage', {}, JSON.stringify(message));
      setInputMessage('');
    }
  };

  const handleTyping = (isTyping) => {
    if (stompClient) {
      const typingStatus = {
        userId: '98b52895-6fbc-4c83-a3ce-971bf0916868',
        isTyping,
      };

      stompClient.send('/app/typing', {}, JSON.stringify(typingStatus));
    }
  };

  const handleRead = useCallback((messageId) => {
    if (stompClient) {
      const readReceipt = {
        id: messageId,
        senderId: userIdFromURL,
        seen: true,
      };

      stompClient.send('/app/read-receipt', {}, JSON.stringify(readReceipt));
    }
  }, [stompClient, userIdFromURL]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
        handleRead(lastMessage.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stompClient, chatMessages, handleRead]);

  const handleBack = () => {
    navigate(`/admin`);
  };

  return (
    <div className={styles['chat-container']}>
      <button className={styles['back-button']} onClick={handleBack}>
          Back
        </button>
      <div className={styles['chat-box']}>
        {chatMessages.map((message, index) => (
          <div key={index}>
            {
            //hasReadReceipt && (
              //(document.hidden ? '❌' : '✔')
            //)
            }
            {message.senderId === userIdFromURL ? (
              `(${formatTimestamp(message.timestamp)}) ${userUsername}: ${message.text}`
            ) : (
              `(${formatTimestamp(message.timestamp)}) Me: ${message.text}`
            )}
          </div>
        ))}
        {isTyping && <div>{`${userUsername} is typing...`}</div>}
      </div>
      <div className={styles['message-input']}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
            handleTyping(e.target.value !== '');
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AdminChat;
