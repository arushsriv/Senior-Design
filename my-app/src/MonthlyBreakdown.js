import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/cardOffers.css';
// import { type } from 'requests';
import Navigation from './components/Menu';
import Footer from './components/Footer';

const MonthlyBreakdown = () => {
  const [top5Data, setTop5Data] = useState([]);


  useEffect(() => {
    const today = new Date();
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const formattedDate = `${firstDayOfLastMonth.getFullYear()}-${(firstDayOfLastMonth.getMonth() + 1).toString().padStart(2, '0')}-01`;
    console.log(formattedDate)
    console.log(typeof(formattedDate))
  
    const fetchTop5Data = async () => {
      console.log('fetch')
      try {
        console.log('fetch2')
        const response = await axios.get(`http://localhost:8080/top5/${formattedDate}`);
        console.log('API Response:', response);
        setTop5Data(response.data.top5Data);
        console.log('top5Data:', response.data.top5Data);
      } catch (error) {
        console.error('Error fetching top 5 data:', error);
      }
    };
  
    fetchTop5Data();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  console.log('top5Data outside useEffect:', top5Data);
  return (
    <div className="layout">
      <header>
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
      <div>
          <Navigation/>
        </div>

        <div className="line-delimiter" />

        <section className="content">
          <div className="card-offers">
            <h1>Monthly Category Breakdown</h1>
            <div className="card-list">
              {top5Data.map((category) => (
                <div key={category.Category} className="card-item">
                  <h2>{category.Category}</h2>
                  <ul>
                    {category.transactions.map((transaction, index) => (
                      <li key={index}>{transaction[0].Description}: {transaction[0].Debit}</li>
                    ))}

                  </ul>
                  {/* Add more details or links as needed */}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div>
        <Footer/>
      </div>             
      
    </div>
  );
};

export default MonthlyBreakdown;
