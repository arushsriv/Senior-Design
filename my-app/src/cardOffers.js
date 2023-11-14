import React from 'react';
import { Link } from 'react-router-dom';
// import '../css/cardOffers.css'; // Create this CSS file for styling if needed

const cardData = [
  {
    id: 1,
    cardName: 'Card 3',
    cardImage: '/images/card3.png',
    feature1: 'Feature 3A',
    feature2: 'Feature 3B',
    feature3: 'Feature 3C',
    feature4: 'Feature 3D',
  },
  {
    id: 2,
    cardName: 'Card 4',
    cardImage: '/images/card4.png',
    feature1: 'Feature 4A',
    feature2: 'Feature 4B',
    feature3: 'Feature 4C',
    feature4: 'Feature 4D',
  },
  {
    id: 3,
    cardName: 'Card 5',
    cardImage: '/images/card5.png',
    feature1: 'Feature 5A',
    feature2: 'Feature 5B',
    feature3: 'Feature 5C',
    feature4: 'Feature 5D',
  },
  // Add more card data as needed
];

function cardOffers() {
  return (
    <div className="layout">
      <header>
        <h1>BudGify</h1>
      </header>

      <div className="main-content">
        <nav>
          <ul>
            <li>Apply for credit card</li>
            <br />
            <li>Check the credit score</li>
            <br />
            <li>My Profile</li>
          </ul>
        </nav>

        <div className="line-delimiter" />

        <section className="content">
          <div className="card-offers">
            <h1>Card Offers</h1>
            <div className="card-list">
              {cardData.map((card) => (
                <div key={card.id} className="card-item">
                  <img src={card.cardImage} alt={card.cardName} />
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
      <div>
        <Link to={'/'}> <button className="full-width-button"><b>Home</b></button></Link>

      </div>

      <footer>
        <p>
          Notice. TermsFeed uses cookies to provide necessary website functionality, improve your experience and analyze our traffic. By using our website, you agree to our legal policies: Privacy Policy, Cookies Policy
        </p>
      </footer>
    </div>











  );
}

export default cardOffers;