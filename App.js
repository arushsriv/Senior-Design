import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import './App.css';



function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    captcha: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can add your logic to handle form submission, including captcha validation.
    console.log('Form submitted:', formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const recaptchaToken = await generateRecaptchaToken();

    if (recaptchaToken) {
      // Send the recaptchaToken and other form data to your backend for verification.
      console.log('Form submitted with reCAPTCHA token:', recaptchaToken);
      console.log('Form data:', formData);
    } else {
      alert('reCAPTCHA verification failed. Please try again.');
    }
  };

  const generateRecaptchaToken = () => {
    return new Promise((resolve) => {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.execute('6Lfj6PkoAAAAAK1bI0ITxUifhtIub7RE6BRy9vCR', { action: 'LOGIN' })
          .then((token) => {
            resolve(token);
          });
      });
    });
  };

  const [recaptchaToken, setRecaptchaToken] = useState(null);

const handleCaptchaChange = (token) => {
  setRecaptchaToken(token);
};

  return (
    <div className="App">
      <h1>Welcome to Budgify</h1>
      <p>A financial literacy app with budgeting, credit card recommender, and credit card point optimization functions.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Captcha:</label>
          <ReCAPTCHA
            sitekey="6Lfj6PkoAAAAAK1bI0ITxUifhtIub7RE6BRy9vCR"
            onChange={handleCaptchaChange}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {/* <Link to="/separate-page">Go to Separate Page</Link> Link to a separate page */}
    </div>
  );
}

export default App;
