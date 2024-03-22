import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUser } from './loginRegisterAPI';
import ".//css/register.css";
import axios from 'axios';

export default function Register() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [friends] = useState([]);
  const [friendsReq] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      firstName, lastName, email, username, password
    };
    console.log("before");
    displayRegister(obj);
    console.log("success");
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault(); 
    window.location.href = '/';
  };

  async function displayRegister(obj) {
    try {
      const response = await axios.post('http://localhost:8080/adduser', obj);
      console.log("after axios post");
      if (response.status === 201) {
        console.log("registered success");
        toast.success("Registered successfully!");
        window.location.href = '/home'; // redirect as needed 
        console.log("redirected");
      } else {
        console.log("registration failed");
        toast.error(`Registration failed: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("There was an error registering the user:", error);
      toast.error("Registration failed: " + (error.response?.data?.error || "Network error"));
    }
  }

  return (
    <form className="register" onSubmit={handleSubmit}>
      <div className="div">
        <div className="text-wrapper">Budgify Sign Up</div>
        <div className="frame">
          <input className="email" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name' />
        </div>
        <div className="email-wrapper">
          <input className="email" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' />
        </div>
        <div className="input-wrapper">
          <input className="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        </div>
        <div className="frame-4">
          <input className="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        </div>
        <div className="frame-2">
          <input className="email" value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' />
        </div>
        <div className="div-wrapper">
          <button className="signup" type="submit">Sign Up</button>
        </div>
        <div className="frame-3">
          <button className="p" onClick={handleLoginRedirect}>Already have an account? Login</button>
        </div>
      </div>
    </form>
  );
}