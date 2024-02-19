import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUser } from './loginRegisterAPI';
import ".//css/register.css";

function Register() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [friends] = useState([]);
  const [friendsReq] = useState([]);

  const isValidate = () => {
    let isproceed = true;
    let errorMessage = 'Please enter value: ';
    if (firstName === null || firstName === '') {
      isproceed = false;
      errorMessage += 'firstName';
    }
    if (lastName === null || lastName === '') {
      isproceed = false;
      errorMessage += 'lastName';
    }
    if (email === null || email === '') {
      isproceed = false;
      errorMessage += 'email';
    }
    if (id === null || id === '') {
      isproceed = false;
      errorMessage += 'username';
    }
    if (password === null || password === '') {
      isproceed = false;
      errorMessage += 'password';
    }
    if (!isproceed) {
      toast.warning(errorMessage);
    } else {
      // if (/^[a-zA-Z0-9] + @[a-zA-Z0-9] + \.[A^Za-z]+$/.test(email)) {

      // } else {
      //     isproceed = false;
      //     toast.warning('Please enter a valid email');
      // }
    }
    return isproceed;
  };

  async function displayRegister(obj) {
    const res = await createUser(obj);
    console.log('RES', res);
    if (res.error) {
      toast.error(`Failed: ${res.err.message}`);
    } else {
      toast.success('registered!');
      window.location.href = '/';
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      id, password, email, firstName, lastName, friends, friendsReq,
    };
    if (isValidate()) {
      displayRegister(obj);
    }
  };

  return (
    <div className="register" onSubmit={handleSubmit}>
      <div className="div">
        <div className="text-wrapper">Budgify Sign Up</div>
        <div className="frame">
          <input className="email" type="username" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name' />
        </div>
        <div className="email-wrapper">
          <input className="email" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' />
        </div>
        <div className="input-wrapper">
          <input className="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        </div>
        <div className="frame-2">
          <input className="email" value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' />
        </div>
        <div className="div-wrapper">
          <button className="signup" type="submit">Sign Up</button>
        </div>
        <div className="frame-3">
          <a href='/'>
            <button className="p">Already have an account? Login</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;