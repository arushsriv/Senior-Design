import './App.css';

import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';

function mainPage() {
  return (
    <div className="layout">
      <header>
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
        <nav>
          <ul>
            <Link to={'/'}><button>Home</button></Link>
            <br />
            <button>My Profile</button>
            <br />
            <Link to={'/preferences'}><button>Budget</button></Link>
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
                <h1>Welcome John Doe</h1>
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

export default mainPage;