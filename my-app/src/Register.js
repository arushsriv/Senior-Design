import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUser } from './loginRegisterAPI';

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

  // async function displayRegister(obj) {
  //   const res = await createUser(obj);
  //   console.log('RES', res);
  //   if (res.error) {
  //     toast.error(`Failed: ${res.err.message}`);
  //   } else {
  //     toast.success('registered!');
  //     window.location.href = '/';
  //   }
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      id, password, email, firstName, lastName, friends, friendsReq,
    };
    if (isValidate()) {
      // displayRegister(obj);
    }
  };

  return (
    <div className="loginApp">
      <div className="auth-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor="firstName">
            First Name
            <input
              className="loginInput"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
                        // id="firstName"
              placeholder="John"
            />
          </label>
          <label htmlFor="lastName">
            Last Name
            <input
              className="loginInput"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
                    // id="lastName"
              placeholder="Doe"
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              className="loginInput"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                    // id="email"
              placeholder="email"
            />
          </label>
          <br />
          <label htmlFor="username">
            Username
            <input
              className="loginInput"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="username"
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              className="loginInput"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
            />
          </label>
          <br />

          <a href="/home">
            <button type="button" className="loginButton link-button">Sign Up</button>
          </a>

        </form>
        <a href="/">
          <button data-testid="login" type="button" className="loginButton link-button">Already have an Account? Sign in</button>
        </a>

      </div>
    </div>
  );
}

export default Register;