import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios'; 
import './App.css';

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // State for reCAPTCHA token
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Update form data on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle reCAPTCHA change
  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  // // Handle form submission
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   // Get reCAPTCHA token
  //   const recaptchaToken = await generateRecaptchaToken();

  //   if (recaptchaToken) {
  //     // Send the reCAPTCHA token and other form data to your backend for verification.
  //     console.log('Form submitted with reCAPTCHA token:', recaptchaToken);
  //     console.log('Form data:', formData);
  //     // Add your backend API call here to send the data for verification
  //   } else {
  //     alert('reCAPTCHA verification failed. Please try again.');
  //   }
  // };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Check if reCAPTCHA token is available
    if (recaptchaToken) {
      try {
        // Make a POST request to verify the reCAPTCHA token
        const response = await axios.post('/api/verify-recaptcha', { recaptchaToken }, {
          headers: {
            'Content-Type': 'application/json',
            'X-ReCAPTCHA-Enterprise-Token': 'YOUR_RECAPTCHA_ENTERPRISE_KEY', // Replace with your reCAPTCHA Enterprise key
          },
        });
  
        if (response.data.success) {
          // Continue with the form submission logic
          console.log('Form submitted successfully:', formData);
        } else {
          alert('reCAPTCHA verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying reCAPTCHA token:', error);
        alert('An error occurred. Please try again later.');
      }
    } else {
      alert('reCAPTCHA verification failed. Please try again.');
    }
  };  

  // Generate reCAPTCHA token
  const generateRecaptchaToken = () => {
    return new Promise((resolve) => {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.execute('6LeLVwspAAAAAP20v0G4zGntSw76nPD5LIl6cW7n', { action: 'LOGIN' })
          .then((token) => {
            resolve(token);
          });
      });
    });
  };

  return (
    <div className="App">
      <h1>Welcome to Budgify</h1>
      <p>A financial literacy app with budgeting, credit card recommender, and credit card point optimization functions.</p>
      <form onSubmit={handleFormSubmit}>
        {/* Form inputs */}
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>
        {/* ... (repeat for other form fields) */}
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
          {/* ReCAPTCHA component */}
          <ReCAPTCHA sitekey="6LeLVwspAAAAAP20v0G4zGntSw76nPD5LIl6cW7n" onChange={handleCaptchaChange} />
        </div>
        {/* Submit button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default App;


// import React, { useState } from 'react';
// import ReCAPTCHA from "react-google-recaptcha";
// // import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
// import './App.css';

// <script src="https://www.google.com/recaptcha/enterprise.js?render=6Lfj6PkoAAAAAK1bI0ITxUifhtIub7RE6BRy9vCR" async defer></script>


// function onClick(e) {
//   e.preventDefault();
//   grecaptcha.enterprise.ready(async () => {
//     const token = await grecaptcha.enterprise.execute('6Lfj6PkoAAAAAK1bI0ITxUifhtIub7RE6BRy9vCR', {action: 'LOGIN'});
//   });
// }


// function App() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     captcha: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here, you can add your logic to handle form submission, including captcha validation.
//     console.log('Form submitted:', formData);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const recaptchaToken = await generateRecaptchaToken();

//     if (recaptchaToken) {
//       // Send the recaptchaToken and other form data to your backend for verification.
//       console.log('Form submitted with reCAPTCHA token:', recaptchaToken);
//       console.log('Form data:', formData);
//     } else {
//       alert('reCAPTCHA verification failed. Please try again.');
//     }
//   };

//   const generateRecaptchaToken = () => {
//     return new Promise((resolve) => {
//       window.grecaptcha.enterprise.ready(() => {
//         window.grecaptcha.enterprise.execute('6Lfj6PkoAAAAAK1bI0ITxUifhtIub7RE6BRy9vCR', { action: 'LOGIN' })
//           .then((token) => {
//             resolve(token);
//           });
//       });
//     });
//   };

//   const [recaptchaToken, setRecaptchaToken] = useState(null);

// const handleCaptchaChange = (token) => {
//   setRecaptchaToken(token);
// };

//   return (
//     <div className="App">
//       <h1>Welcome to Budgify</h1>
//       <p>A financial literacy app with budgeting, credit card recommender, and credit card point optimization functions.</p>
//       <form onSubmit={handleSubmit}>
        // <div className="form-group">
        //   <label>First Name:</label>
        //   <input
        //     type="text"
        //     name="firstName"
        //     value={formData.firstName}
        //     onChange={handleInputChange}
        //     required
        //   />
        // </div>
        // <div className="form-group">
        //   <label>Last Name:</label>
        //   <input
        //     type="text"
        //     name="lastName"
        //     value={formData.lastName}
        //     onChange={handleInputChange}
        //     required
        //   />
        // </div>
        // <div className="form-group">
        //   <label>Email:</label>
        //   <input
        //     type="email"
        //     name="email"
        //     value={formData.email}
        //     onChange={handleInputChange}
        //     required
        //   />
        // </div>
        // <div className="form-group">
        //   <label>Password:</label>
        //   <input
        //     type="password"
        //     name="password"
        //     value={formData.password}
        //     onChange={handleInputChange}
        //     required
        //   />
        // </div>
//         <div className="form-group">
//           <label>Captcha:</label>
//           <ReCAPTCHA
//             sitekey="6Lfj6PkoAAAAAK1bI0ITxUifhtIub7RE6BRy9vCR"
//             onChange={handleCaptchaChange}
//           />
//         </div>
//         <button type="submit">Sign Up</button>
//       </form>
//       {/* <Link to="/separate-page">Go to Separate Page</Link> Link to a separate page */}
//     </div>
//   );
// }

// export default App;
