
import React, { useState } from 'react';
import Navigation from './components/Menu';
import Footer from './components/Footer';
import CreditCardComponent from './components/CreditCardComponent'
import "./css/cardOffers.css"


const CardFilterForm = ({ onSubmit, hideForm }) => {

  const [formData, setFormData] = useState({
    debt: .2,
    newCards: 1,
    annualFeePreference: 'yes',
    annualFeeLimit: 100,
    averageTotalMonthlyBalance: 1000,
    ficoScore: 700,
    bonusWeight: .4,
    highSpending: 'travel',
    preferredStore: 'amazon'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    hideForm();
  };

  return (
    hideForm && (
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td align="right">Enter Debt to Income Ratio:</td>
              <td>
                <input
                  type="text"
                  name="debt"
                  value={formData.debt}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Enter number of new cards in the past 24 months:</td>
              <td>
                <input
                  type="text"
                  name="newCards"
                  value={formData.newCards}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Do you want a card with an annual fee? (yes/no):</td>
              <td>
                <input
                  type="text"
                  name="annualFeePreference"
                  value={formData.annualFeePreference}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">How much of a fee are you willing to spend:</td>
              <td>
                <input
                  type="text"
                  name="annualFeeLimit"
                  value={formData.annualFeeLimit}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Enter Average Total Monthly Balance:</td>
              <td>
                <input
                  type="text"
                  name="averageTotalMonthlyBalance"
                  value={formData.averageTotalMonthlyBalance}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Enter FICO Score:</td>
              <td>
                <input
                  type="text"
                  name="ficoScore"
                  value={formData.ficoScore}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Input a number between 0 and 1 indicating how much you value a good card bonus deal versus long term points:</td>
              <td>
                <input
                  type="text"
                  name="bonusWeight"
                  value={formData.bonusWeight}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Enter High Spending Categories (comma-separated):</td>
              <td>
                <input
                  type="text"
                  name="highSpending"
                  value={formData.highSpending}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td align="right">Enter Preferred Stores/Travel Partners:</td>
              <td>
                <input
                  type="text"
                  name="preferredStore"
                  value={formData.preferredStore}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    )
  );
};

const CardOffersPage = () => {

  const [filteredCards, setFilteredCards] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleFilterSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/getTopCreditCards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setFilteredCards(data.topCards);
      console.log(data.topCards)
      setFormSubmitted(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  const hideForm = () => {
    setFormSubmitted(false); // Set formSubmitted to true to hide the form
  };

  return (
    <div className="layout">
      <header className="headerAppName">
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
        <div>
          <Navigation />
        </div>

        <div className="line-delimiter" />

        <section className="content">
          <div className="card-offers">
            <h1>Card Offers</h1>

            {/* Render CardFilterForm with onSubmit handler */}

            <div>
              {/* Render filtered cards */}
              {filteredCards.length === 0 &&
                <CardFilterForm onSubmit={handleFilterSubmit} hideForm={hideForm} />

              }

              {filteredCards.length > 0 &&
                <CreditCardComponent creditCards={filteredCards} />
                }
            </div>
          </div>
        </section>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
export default CardOffersPage;