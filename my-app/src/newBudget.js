import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './/css/PostLoginScreen.css';
import { Link } from 'react-router-dom';

import { PieChart } from './components/PieChart.tsx';

// Samples are in this URL https://react-chartjs-2.js.org/examples/pie-chart

function NewBudget() {
  
  const [budgetData, setBudgetData] = useState(null);
  const [showData, setShowData] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState();
  const [loggedInUser] = useState('riakul');
  const [overallBudget, setOverallBudget] = useState(500)


  useEffect(() => {
    // Function to fetch data from the web service
    const fetchData = async () => {
      const today = new Date();
      setSelectedMonth(today.getMonth() - 1);
      try {
        const requestBody = {
          user_id: loggedInUser,
          desired_month: selectedMonth
        };

        const response = await axios.post('http://127.0.0.1:5000/predict-spending', requestBody);

        const labels = Object.keys(response.data.predicted_spending);
        const dataValues = Object.values(response.data.predicted_spending);
        const numColors = dataValues.length;
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          const hue = (360 / numColors) * i;
          const color = `hsl(${hue}, 70%, 50%)`;
          colors.push(color);
        }
        const graphdata = {
          labels: labels,
          datasets: [
            {
              label: labels,
              data: dataValues,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
            },
          ],
        };
        setShowData(true);
        setBudgetData(graphdata);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

    // Cleanup function (optional)
    return () => {
      // You can perform any cleanup here if necessary
    };
  }, [selectedMonth, loggedInUser]); // Dependency array includes the callback function


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
            <br />
            <Link to={'/profile'}><button>My Profile</button> </Link>
            <br />
            <br />
            <Link to={'/budget'}><button>Budget</button></Link>
            <br />
            <br />
            <li><Link to="/preferences"><button>Preferences</button></Link></li>
            <br />
            <Link to={'/card-offers'}><button>Credit Card Recommendations</button></Link>
          </ul>
        </nav>
        <div className="line-delimiter" />
        <section className="content">
          <div className="App">
            <div className="post-login-screen">
              <div className="gray-box2" align="center">
                <div className="grid-container">
                  <div className="grid-item">
                    {showData ? (
                      <div className="credit-card-container">
                        <div>
                          <h1>Monthly Budget for {loggedInUser}</h1>

                          <PieChart chartData={budgetData} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="grid-item">
                    <div className="table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Label</th>
                            <th>Data</th>
                          </tr>
                        </thead>
                        {budgetData && budgetData.labels.length > 0 && (
                          <tbody>
                            {budgetData.labels.map((label, index) => (
                              <tr key={index}>
                                <td>{label}</td>
                                <td>{budgetData.datasets[0].data[index].toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <Link to={'/preferences'}><button>Preferences</button></Link>
              <Link to={'/new-budget'}><button>Create New Budget</button></Link>
              <Link to={'/breakdown'}><button>Monthly Budget Breakdown</button></Link>
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