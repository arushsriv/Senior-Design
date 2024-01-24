import React from 'react';
import { Link } from 'react-router-dom';
import './/css/cardOffers.css'; // Create this CSS file for styling if needed

const cardData = [
  {
    id: 1,
    cardName: 'Shopping',
    feature1: 'Detail 3A',
    feature2: 'Detail 3B',
    feature3: 'Detail 3C',
    feature4: 'Detail 3D',
  },
  {
    id: 2,
    cardName: 'Dining',
    feature1: 'Detail 4A',
    feature2: 'Detail 4B',
    feature3: 'Detail 4C',
    feature4: 'Detail 4D',
  },
  {
    id: 3,
    cardName: 'Grocery',
    feature1: 'Detail 5A',
    feature2: 'Detail 5B',
    feature3: 'Detail 5C',
    feature4: 'Detail 5D',
  },
  // Add more card data as needed
];

function MonthlyBreakdown() {
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
            <Link to={'/budget'}><button>Budget</button></Link>
            <br />
            <button>Point Tracker</button>
            <Link to={'/card-offers'}><button>Credit Card Recommendations</button></Link>
          </ul>
        </nav>


        <div className="line-delimiter" />

        <section className="content">
          <div className="card-offers">
            <h1>Monthly Category Breakdown</h1>
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
                  <Link to={`/details/${card.id}`}>Details</Link>
                </div>
              ))}
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

export default MonthlyBreakdown;