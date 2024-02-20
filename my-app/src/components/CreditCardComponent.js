import React from 'react';
import "../css/cardOffers.css"

const CreditCardComponent = ({ creditCards }) => {
  return (
    <div className="credit-card-container">
    {creditCards.map((card, index) => (
      <div key={index} className="credit-card">
        <div className="credit-card-wrapper">
          
          <div className="credit-card-details">
          <img src={card.imageUrl} alt="Credit Card" />
            <h2>{card.name}</h2>
            <p>Issuer: {card.issuer}</p>
            <p>Annual Fee: {card.annualFee}</p>
            <p>Offer Amount: {card.offerAmount}</p>
            <p>Score Minimum: {card.score_min}</p>
            <a href={card.url}>Details </a>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
};

export default CreditCardComponent;
