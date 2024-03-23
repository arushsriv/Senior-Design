import './App.css';
import React, { useEffect, useState } from 'react';
import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';
import Navigation from './components/Menu';
import Footer from './components/Footer';
const config = require('./config.json');

export default function MainPage() {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const user = {
      username: sessionStorage.getItem('username'),
      firstName: sessionStorage.getItem('firstName'),
      lastName: sessionStorage.getItem('lastName'),
      email: sessionStorage.getItem('email'),
      cc_imageurl_1: sessionStorage.getItem('cc_imageurl_1'),
      cc_imageurl_2: sessionStorage.getItem('cc_imageurl_2'),
      cc_imageurl_3: sessionStorage.getItem('cc_imageurl_3')
    }
    if (user.username === '' || user.username === null) {
      window.location.href = '/'; 
    }
    setUserDetails(user);
  }, []); 

  return (
    <div className="layout">
      <header  className="headerAppName">
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
      <div>
          <Navigation/>
        </div>
        <div className="line-delimiter" />

        <section className="content">

          <div className="App">
            <div className="post-login-screen">
              <div className="gray-box">
                <h1>Welcome {userDetails.firstName} {userDetails.lastName}!</h1>
                <h2> Your credit cards:</h2>
                <div className="credit-card-container">
                  <img src={userDetails.cc_imageurl_1} alt="Credit Card 1" className="credit-card-image" />
                  <img src={userDetails.cc_imageurl_2} alt="Credit Card 2" className="credit-card-image" />
                  <img src={userDetails.cc_imageurl_3} alt="Credit Card 3" className="credit-card-image" />
                </div>

                <div className="credit-card-container">
                  <div>
                    <h2> People Similar to you have applied to....</h2><br/>
                  </div>
                </div>
                <div className="credit-card-container">
                  <div>
                    <img src="/images/card4.png" alt="Credit Card 1" className="credit-card-image" />
                    <img src="/images/card5.png" alt="Credit Card 2" className="credit-card-image" />
                    <img src="/images/card6.png" alt="Credit Card 3" className="credit-card-image" />
                  </div>
                </div>
              </div>
              <Link to={'/card-offers'}><button>Recommend me a card</button></Link>
            </div>
          </div>
        </section>
      </div>
      <div>
        <Footer/>
      </div>

    </div>



  );
}