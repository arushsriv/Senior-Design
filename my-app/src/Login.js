import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import { validateLogin } from './loginRegisterAPI';
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

  // async function displayLogin() {
  //   const resp = await validateLogin(username);
  //   if (resp.error) {
  //     toast.error(resp.error.message);
  //   } else if (Object.keys(resp).length === 0) {
  //     toast.error('Invalid username');
  //   } else if (resp.password === password) {
  //     toast.success('login successful');
  //     sessionStorage.setItem('username', username);
  //     window.location.href = `/user/${username}`;
  //   } else {
  //     toast.error('Invalid password');
  //   }
  // }

  const validate = () => {
    let result = true;
    if (username === '' || username === null) {
      result = false;
      toast.warning('Please enter username');
    }
    if (password === '' || password === null) {
      result = false;
      toast.warning('please enter password');
    }
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    if (validate()) {
      // try {
      //   const response = await fetch('http://localhost:3001/login', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ username, password }),
      //   });
      //   const data = await response.json();
      //   if (response.status === 200) {
      //     toast.success(data.message);
      //     sessionStorage.setItem('username', username); 
      //     window.location.href = '/user/${username}';
      //   } else {
      //     toast.error(data.message);
      //   }
      // } catch (error) {
      //   toast.error("login failed");
      // }
      // // displayLogin();
      // // console.log("LOGIN RSP", resp);
    }
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
              <button type="button" className="loginButton link-button">Login</button>
            </a>

          </form>

          <a href="/register">
            <button type="button" className="loginButton link-button">Register</button>
          </a>

          <button type="button" className="loginButton password-button">Forgot Password</button>

        </div>
    </div>
    ) : (
          loggedIn && <MainPage username={username} password={password} />
      )}
      </div>
  );
}

// export default Login;
