import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { validateLogin } from './loginRegisterAPI';
import  ".//css/login.css";
import './App.css';



function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  async function displayLogin() {
    const resp = await validateLogin(username);
    if (resp.error) {
      toast.error(resp.error.message);
    } else if (Object.keys(resp).length === 0) {
      toast.error('Invalid username');
    } else if (resp.password === password) {
      toast.success('login successful');
      sessionStorage.setItem('username', username);
      window.location.href = `/user/${username}`;
    } else {
      toast.error('Invalid password');
    }
  }

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
    if (validate()) {
      displayLogin();
      // console.log("LOGIN RSP", resp);
    }
  };
      return (
        <div className="index" onSubmit={handleSubmit}>
          <div className="div">
            <div className="text-wrapper">Budgify</div>
            <div className="text-wrapper-2"><button type="button"> Forgot Password? </button></div>
            <div className="text-wrapper-3">Email</div>
            <div className="text-wrapper-4">Password</div>
            
            <div className="div-wrapper2">
            <button className="text-wrapper-5" type="submit">Login</button>
            </div>
            <div className="div-wrapper">
            <a href="/register">
            <button className="text-wrapper-5" >Sign Up</button>
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
      );
}

export default Login;
