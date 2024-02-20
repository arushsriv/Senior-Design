import React, { useEffect, useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import { toast } from 'react-toastify';
import { validateLogin } from './loginRegisterAPI';
import  ".//css/login.css";



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
        // <div>
        //   {!loggedIn ? (
        <div className="index" onSubmit={handleSubmit}>
          <div className="div">
            <div className="text-wrapper">Budgify</div>
            <div className="text-wrapper-2"><button type="button"> Forgot Password? </button></div>
            {/* <button data-testid="submitButton" className="loginButton">Forgot Password</button> */}
            <div className="text-wrapper-3">Email</div>
            <div className="text-wrapper-4">Password</div>
            
            <div className="div-wrapper2">
            <button className="text-wrapper-5" type="submit">Login</button>
            {/* <a href="/home">
              <button data-testid="submitButton" className="loginButton" type="submit">Login</button>
            </a> */}
            </div>
            <div className="div-wrapper">
            <a href="/register">
            <button className="text-wrapper-5" >Sign Up</button>
            {/* <a href="/register">
              <button data-testid="submitButton" className="loginButton">Register</button>
            </a> */}
            </a>
            </div>
            <div className="frame-2">
              <input className="text-wrapper-7" value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder='123@abc.com' id="username" name="username"/>
            </div>
            <div className="password-wrapper">
              <input className="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='password' id="password" name="password"/>
            </div>
          </div>
        </div>
      //   ) : (
      //     loggedIn && <MainPage username={username} password={password} />
      //   )}
      // </div>
      );
}

// export default Login;
