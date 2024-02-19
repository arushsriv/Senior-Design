import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './/css/PostLoginScreen.css';
import { Link } from 'react-router-dom';

import { PieChart } from './components/PieChart.tsx';
import Navigation from './components/Menu.js';
import Footer from './components/Footer.js';

// Samples are in this URL https://react-chartjs-2.js.org/examples/pie-chart

function BudgetGraphs() {

  const [budgetData, setBudgetData] = useState(null);
  const [showData, setShowData] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState();
  const [loggedInUser, setLoggedInUser] = useState('riakul');
  const [graphData, setGraphData] = useState();

  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];

  const buildGraphData = () => {
    if (budgetData) {
      let formattedMonth=12
      if(selectedMonth <10)
         formattedMonth = '0'+selectedMonth;

      const filteredData = budgetData.budget_spending[formattedMonth];
      const labels = Object.keys(filteredData);
      const dataValues = Object.values(filteredData);
      console.log(dataValues);
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
            label: '%',
            data: dataValues,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      };
      setShowData(true);
      setGraphData(graphdata);

    }else{
      setShowData(false);
      setGraphData(null);
    }

  }

  const handleChange = (e) => {
    const selectedValue = e.target.value !== null ? parseInt(e.target.value) : 12;
    setSelectedMonth(selectedValue);

  };




  useEffect(() => {
    // Function to fetch data from the web service
    const fetchData = async () => {
      try {
        const requestBody = {
          user_id: loggedInUser,
          desired_month: selectedMonth
        };

        const response = await axios.post('http://127.0.0.1:5000/budget-spending', requestBody);
        setBudgetData(response.data);
        buildGraphData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

    // Cleanup function (optional)
    return () => {
      // You can perform any cleanup here if necessary
    };
  }, [loggedInUser, selectedMonth]); // Dependency array includes the callback function


  return (
    <div className="layout">
      <header className="headerAppName">
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
      <div>
          <Navigation/>
        </div>

        <div className="line-delimiter" />
        <section className="content">
          <div className="App">
            <div className="post-login-screen">
              <div className="gray-box2" align="center">
                <div className="grid-container">
                  <div className="grid-item">
                    <b>Please select a Month: </b>
                    <select className="dropdown-box-large" value={selectedMonth} onChange={handleChange}>
                      <option value="">Select Month</option>
                      {months.map(month => (
                        <option key={month.value} value={month.value}>{month.name}</option>
                      ))}
                    </select>
                    {showData ? (
                      <div className="credit-card-container">
                        <div>
                          <h1>Monthly Budget for {loggedInUser}</h1>

                          <PieChart chartData={graphData} />
                        </div>
                      </div>
                    ) : null}
                    <p>You have 10% left in your budget for the month</p>
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
                        {/* {budgetData && budgetData.labels.length > 0 && (
                          <tbody>
                            {budgetData.labels.map((label, index) => (
                              <tr key={index}>
                                <td>{label}</td>
                                <td>{budgetData.datasets[0].data[index].toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        )} */}
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
      <div>
        <Footer/>
      </div>
    </div>



  );
}

export default BudgetGraphs;