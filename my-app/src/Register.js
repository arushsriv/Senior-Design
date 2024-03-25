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
    displayRegister(obj);
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault(); 
    window.location.href = '/';
  };

  async function displayRegister(obj) {
    try {
      const response = await axios.post('http://localhost:8080/adduser', obj);
      if (response.status === 201) {
        toast.success("Registered successfully!");
        sessionStorage.setItem('username', response.data.user.username); 
        sessionStorage.setItem('email', response.data.user.email); 
        sessionStorage.setItem('firstName', response.data.user.firstName);
        sessionStorage.setItem('lastName', response.data.user.lastName); 
        if (response.data.user.username === 'arushis') {
          await axios.post('http://localhost:8080/addcc', { username: 'arushis' });
          sessionStorage.setItem('cc_imageurl_1', response.data.user.credit_cards[0].cc_imageurl)
          sessionStorage.setItem('cc_imageurl_2', response.data.user.credit_cards[1].cc_imageurl)
          sessionStorage.setItem('cc_imageurl_3', response.data.user.credit_cards[2].cc_imageurl)
          window.location.href = '/home'; // redirect as needed 
        } else if (response.data.user.username === 'jwang') {
          await axios.post('http://localhost:8080/addcc', { username: 'jwang' });
          sessionStorage.setItem('cc_imageurl_1', response.data.user.credit_cards[0].cc_imageurl)
          sessionStorage.setItem('cc_imageurl_2', response.data.user.credit_cards[1].cc_imageurl)
          sessionStorage.setItem('cc_imageurl_3', response.data.user.credit_cards[2].cc_imageurl)
          window.location.href = '/home'; // redirect as needed 
        } else if (response.data.user.username === 'riakul') {
          await axios.post('http://localhost:8080/addcc', { username: 'riakul' });
          sessionStorage.setItem('cc_imageurl_1', response.data.user.credit_cards[0].cc_imageurl)
          sessionStorage.setItem('cc_imageurl_2', response.data.user.credit_cards[1].cc_imageurl)
          sessionStorage.setItem('cc_imageurl_3', response.data.user.credit_cards[2].cc_imageurl)
          window.location.href = '/home'; // redirect as needed 
        }
      } else {
        toast.error(`Registration failed: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Registration failed: " + (error.response?.data?.error || "Network error"));
    }
  };

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