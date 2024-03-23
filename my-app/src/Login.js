import React, { useEffect, useState } from 'react';
import './App.css';
import MainPage from './mainPage';
import { toast } from 'react-toastify';
import { validateLogin } from './loginRegisterAPI';
import  ".//css/login.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Login() {
// function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username, 
        password
      });

      if (response.status === 200) {
        setLoggedIn(true); 
        console.log("User data:", response.data); 
        sessionStorage.setItem('username', username); 
        window.location.href = '/home';
      } else {
        toast.error("Login failed: " + (response.data.error || "Invalid credentials"));
        setLoggedIn(false); 
      }
    } catch (error) {
      console.error("Login request failed:", error); 
      toast.error("Login request failed: " + (error.response?.data?.error || "Network error"));
    }
  };

  const handleSignUpRedirect = (e) => {
    e.preventDefault();
    window.location.href = '/register'
  };
  
  return (
    <div>
        <form className="index" onSubmit={handleSubmit}>
          <div className="div">
            <div className="text-wrapper">Budgify</div>
            <div className="text-wrapper-2">
              <button data-testid="submitButton" className="loginButton" type="button"> Forgot Password? </button>
            </div>
            <div className="text-wrapper-3">Username</div>
            <div className="text-wrapper-4">Password</div>
            
            <div className="div-wrapper2">
              <button className="text-wrapper-5" type="submit">Login</button>
            </div>
            <div className="div-wrapper">
              <button className="text-wrapper-5" onClick={handleSignUpRedirect} type="button">Sign Up</button>
            </div>
            <div className="frame-2">
              <input className="text-wrapper-7" value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder='username' id="username" name="username"/>
            </div>
            <div className="password-wrapper">
              <input className="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='password' id="password" name="password"/>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
      );
}

// export default Login;
