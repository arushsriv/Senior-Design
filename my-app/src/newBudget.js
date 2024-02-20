import './App.css';

import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';

function NewBudget() {
    const cardData = [
        {
          id: 1,
          cardName: 'Budget',
          feature1: 'Shopping: $100',
          feature2: 'Restaurant: $100',
          feature3: 'Travel: $50',
          feature4: 'Clubs: $100',
        }]
  return (
    <div className="layout">
      <header>
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
        <nav>
          <ul>
            <Link to={'/home'}><button>Home</button></Link>
            <br />
            <Link to={'/profile'}><button>My Profile</button> </Link>
            <br />
            <Link to={'/plaid'}><button>Connect with Plaid</button> </Link>
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
              <div className="gray-box2">
                <div className="credit-card-container">
                  <img src="/images/pie_chart.png" alt="Credit Card 3" className="budget-image" />
                </div>
                <div className="card-list">
              {cardData.map((card) => (
                <div key={card.id} className="card-item">
                  <h2>{card.cardName}</h2>
                  <ul>
                    <li>{card.feature1}</li>
                    <li>{card.feature2}</li>
                    <li>{card.feature3}</li>
                    <li>{card.feature4}</li>
                </ul>
                </div>
              ))}
              </div>
              <Link to={'/budget'}><button>Back</button></Link>
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

export default NewBudget;