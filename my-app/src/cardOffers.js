import React, { useState, useEffect } from 'react';
import Navigation from './components/Menu';
import Footer from './components/Footer';
import CreditCardComponent from './components/CreditCardComponent'
import "./css/cardOffers.css"

const CardOffersPage = () => {
  const [filteredCards, setFilteredCards] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  // const [debtToIncomeRatio, setDebtRatio] = useState(0);
  // const [newCards, setNewCards] = useState();
  // const [annualFeePreference, setAnnualFeePreference] = useState();
  // const [annualFeeLimit, setAnnualFeeLimit] = useState();
  // const [bonusWeight, setBonusWeight] = useState();
  // const [monthlyBalance, setMonthlyBalance] = useState();
  // const [ficoScore, setFicoScore] = useState();
  // const [highSpending, setHighSpending] = useState();
  // const [preferredStore, setPreferredStore] = useState('amazon');
  var debtToIncomeRatio;
  var newCards;
  var annualFeePreference;
  var annualFeeLimit;
  var bonusWeight;
  var averageTotalMonthlyBalance;
  var ficoScore;
  var highSpendingCategories;
  var preferredStoresTravelPartners = 'amazon';
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`/getpreferences/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        const data = await response.json();
        const pref = data.data;
        setUserPreferences(pref);
        debtToIncomeRatio = pref.debt_income_ratio;
        debtToIncomeRatio = parseFloat(debtToIncomeRatio);
        newCards = parseInt(pref.number_cc);
        annualFeePreference = pref.fee_pref === 'yes'
        annualFeeLimit = parseInt(pref.price);
       if (pref.bonus === 'Only bonus deals') {
        bonusWeight = 0;
       } else { 
        bonusWeight = 1;
       }
       averageTotalMonthlyBalance = parseInt(pref.monthlyBalance);
       ficoScore = parseInt(pref.fico);
       highSpendingCategories = pref.categories;

        handleFilterSubmit();
      } catch (error) {
        console.error(error.message);
      }
    };
    
    fetchPreferences();
  }, []);

  const handleFilterSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/getTopCreditCards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          debtToIncomeRatio,
          newCards,
          annualFeePreference,
          annualFeeLimit,
          bonusWeight,
          averageTotalMonthlyBalance,
          ficoScore,
          highSpendingCategories,
          preferredStoresTravelPartners
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setFilteredCards(data.topCards);
    } catch (error) {
      console.error(error.message);
    }
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

            <div>
              {filteredCards && filteredCards.length > 0 &&
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