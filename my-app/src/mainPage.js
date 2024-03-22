import './App.css';
import React, { useEffect, useState } from 'react';
import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';
import Navigation from './components/Menu';
import Footer from './components/Footer';
const config = require('./config.json');

export default function MainPage() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username === '' || username === null) {
      window.location.href = '/'; 
    }
    setUsername(username);
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
                <h1>Welcome {username}!</h1>
                <div className="credit-card-container">
                  <img src="/images/card1.png" alt="Credit Card 1" className="credit-card-image" />
                  <img src="/images/card2.png" alt="Credit Card 2" className="credit-card-image" />
                  <img src="/images/card3.png" alt="Credit Card 3" className="credit-card-image" />
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