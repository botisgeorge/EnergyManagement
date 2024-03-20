import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8082/spring-demo/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          { username, password }
        )
      });
      const data = await response.json();
      if (data.role === 0 || data.role === 1) {
        dispatch({ type: 'SET_TOKEN', payload: data.token });
        navigate(data.role === 0 ? `/user/${data.id}` : '/admin');
      } else {
        console.error('Invalid role');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles['login-form-container']}>
      <form className={styles['login-form']} onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles['login-input']} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles['login-input']} />
        <div className={styles['button-container']}>
          <button type="submit" className={styles['login-button']}>Log In</button>
        </div>
      </form>
    </div>
  );
}

export default Login;