import React, { useState } from 'react';
import './App.css'; // Assuming CSS file for styling

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    //login logic 
    console.log('Logging in with:', { username, password });
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleSendEmail = () => {
    // logic to send reset password email
    console.log('Sending email to:', email);
    setShowForgotPasswordModal(false);
  };

  const handleSignUp = () => {
    // signup navigation logic here
    console.log('Navigating to sign up page');
  };

  return (
    <div className="login-container">
      <h1>Welcome Back to Budgify!</h1>
      <div>
        <label>Enter username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Enter password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
      </div>
      {showForgotPasswordModal && (
        <div className="modal">
          <label>Enter your email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSendEmail}>Send Email</button>
          <button onClick={() => setShowForgotPasswordModal(false)}>Close</button>
        </div>
      )}
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <button onClick={handleSignUp}>Don't have an account yet? Sign up here!</button>
      </div>
    </div>
  );
};

export default LoginPage;
