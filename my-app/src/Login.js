import React, { useEffect, useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import './css/login.css';

const config = require('./config.json');

export default function Login() {
// function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/`)
    .then(res => res.json())
    .then(resJson => {
      setPassword(resJson)
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  return (
    <div>
      {!loggedIn ? (
      <div className="loginApp">
        <div className="auth-form-container">
          <h1 className="app-title">Budgify</h1>
          <h1 className="app-title">Login Here</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username
              <input className="loginInput" value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="username" id="username" name="username" />
            </label>
            <br />
            <label htmlFor="password">
              Password
              <input className="loginInput" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" id="password" name="password" />
            </label>
            <a href="/home">
              <button data-testid="submitButton" className="loginButton" type="submit">Login</button>
            </a>
          </form>
          <a href="/register">
            <button data-testid="submitButton" className="loginButton">Register</button>
          </a>
          <button data-testid="submitButton" className="loginButton">Forgot Password</button>
        </div>
      </div>
      ) : (
        loggedIn && <MainPage username={username} password={password} />
      )}
    </div>
  );
}