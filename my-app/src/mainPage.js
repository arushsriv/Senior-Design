import './App.css';
import React, { useEffect, useState } from 'react';
import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';
const config = require('./config.json');

export default function MainPage({ username }) {
  const [user, setUser] = useState('');
  console.log("username is: ", username);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/home?username=${username}`)
      .then(res => res.json())
      .then(resJson => setUser(resJson));
  }, []);


  console.log(user)

  return (
    <div className="layout">
      <header>
        <h1>Welcome to Budgify {username}! </h1>
      </header>

      <div className="main-content">
        <nav>
          <ul>
            <Link to={'/home'}><button>Home</button></Link>
            <br />
            <Link to={'/profile'}><button>My Profile</button> </Link>
            <br />
            <Link to={'/budget'}><button>Budget</button></Link>
            <br />
            <button>Point Tracker</button>
            <Link to={'/card-offers'}><button>Credit Card Recommendations</button></Link>
          </ul>
        </nav>

        <div className="line-delimiter" />

        <section className="content">

          <div className="App">
            <div className="post-login-screen">
              <div className="gray-box">
                <h1>Welcome {username}</h1>
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

      <footer>
        <p>
          Notice. TermsFeed uses cookies to provide necessary website functionality, improve your experience and analyze our traffic. By using our website, you agree to our legal policies: Privacy Policy, Cookies Policy
        </p>
      </footer>
    </div>



  );
}