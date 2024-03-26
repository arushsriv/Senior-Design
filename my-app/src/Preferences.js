import './App.css';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './/css/PostLoginScreen.css';
// import { Link } from 'react-router-dom';
import LongButton from './components/LogButton';
import Navigation from './components/Menu';
import Footer from './components/Footer';
import axios from 'axios';
// Samples are in this URL https://react-chartjs-2.js.org/examples/pie-chart

function Preferences() {

  // const [loggedInUser] = useState('riakul');
  const [username, setUsername] = useState('');
  const occupations = ["Doctor", "Lawyer", "Engineer", "Teacher", "Student", "Other"];
  const incomes = ["<$10,000", "$10,000 - $30,000", "$30,000 - $70,000", "$70,000 - $100,000", "$100,000 - $150,000", "$150,000+"];
  const ages = ["<18", "18 - 25", "25 - 35", "35 - 65", "65+"];
  const fee_pref = ["Yes", "No"];
  const bonus = ["Only bonus deals", "long term points"];
  const categoriesList = ["Rent/utilities", "Transportation", "Groceries", "Eating out", "Travel", "Tuition", "Savings"];
  // Return classes based on whether item is checked
  var isCategoryChecked = (item) => state.categories.includes(item) ? "checked-item" : "not-checked-item";
  const notificationsList = ["Daily", "Weekly", "Biweekly", "Monthly"];
  // Return classes based on whether item is checked
  var isNotificationChecked = (item) => state.notifications.includes(item) ? "checked-item" : "not-checked-item";
  // Added

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    setUsername(username);
  }, []); 

  const [state, setState] = useState({
    fname: "",
    lname: "",
    message: "",
    future_goal: "",
    savings_goal: "",
    occupation: "",
    income: "",
    age: "",
    free_prefs: "",
    bonus_op: "",
    debt_income_ratio_op: null,
    isChecked: false,
    categories: [],
    notifications: [],
    gender: "",
    price: null,
    fee_pref: "",
    debt_income_ratio: null,
    bonus: "",
    number_cc: null,
    FICO: null, // Add FICO score state
    monthlyBalance: null
  });


  const occupationsOptions = occupations.map((occupation, key) => (
    <option value={occupation} key={key}>
      {occupation}
    </option>
  ));

  const incomesOptions = incomes.map((income, key) => (
    <option value={income} key={key}>
      {income}
    </option>
  ));



  const bonusOptions = bonus.map((bonus, key) => (
    <option value={bonus} key={key}>
      {bonus}
    </option>
  ));


  const fee_prefOptions = fee_pref.map((fee_pref, key) => (
    <option value={fee_pref} key={key}>
      {fee_pref}
    </option>
  ));

  const agesOptions = ages.map((age, key) => (
    <option value={age} key={key}>
      {age}
    </option>
  ));


  // Add/Remove checked item from list
  const handleCategoryCheck = (event) => {
    var updatedList = [...state.categories];
    if (event.target.checked) {
      updatedList = [...state.categories, event.target.value];
    } else {
      updatedList.splice(state.categories.indexOf(event.target.value), 1);
    }
    setState((state) => ({
      ...state,
      [event.target.name]: updatedList
    }));
  };

  // Generate string of checked items
  const categoriesItems = state.categories.length
    ? state.categories.reduce((total, item) => {
      return total + ", " + item;
    })
    : "";

  // Add/Remove checked item from list
  const handleNotificationsCheck = (event) => {
    var updatedList = [...state.notifications];
    if (event.target.checked) {
      updatedList = [...state.notifications, event.target.value];
    } else {
      updatedList.splice(state.notifications.indexOf(event.target.value), 1);
    }
    setState((state) => ({
      ...state,
      [event.target.name]: updatedList
    }));
  };

  const handleChange = (e) => {
    console.log(e.target)
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    console.log(e.target.name)
    setState((state) => ({
      ...state,
      [e.target.name]: value
    }));
  };

  /**
   * Handle Click will save the data into the database
   */
  const handleClick = async () => {
    try {
      // Create an object with the preferences data
      const preferencesData = {
        username: username,
        fname: state.fname,
        lname: state.lname,
        future_goal: state.future_goal,
        savings_goal: state.savings_goal,
        occupation: state.occupation,
        income: state.income,
        age: state.age,
        free_prefs: state.free_prefs,
        bonus_op: state.bonus_op,
        debt_income_ratio_op: state.debt_income_ratio_op,
        isChecked: state.isChecked,
        categories: state.categories,
        notifications: state.notifications,
        gender: state.gender,
        price: state.price,
        fee_pref: state.fee_pref,
        debt_income_ratio: state.debt_income_ratio,
        bonus: state.bonus,
        number_cc: state.number_cc,
        fico: state.FICO, // Include FICO score in the preferences data
        monthlyBalance: state.monthlyBalance
      };
  
      // Make a POST request to your server
      const response = await axios.post('http://localhost:8080/save-preferences', preferencesData);
      if (response.status === 201) {
        toast.success("Registered successfully!");
      } else {
        toast.error(`Registration failed: ${response.data.error || 'Unknown error'}`);
      }
  
      console.log('Preferences saved successfully:', response.data);
    } catch (error) {
      toast.error("Registration failed: " + (error.response?.data?.error || "Network error"));
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
        <div className="App">
          <div className="post-login-screen">
            <div className="gray-box2" align="center">
              <div className="grid-container">
                <div className="grid-item">
                  <div className="credit-card-container">
                    <table className="custom-table">
                      <tbody>
                        <tr>
                          <td><label>Future Goal:</label></td>
                          <td><textarea name="future_goal" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                          <td><label>Savings Goal:</label></td>
                          <td><textarea name="savings_goal" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                          <td><label>Occupation:</label></td>
                          <td>
                            <select
                              name="occupation"
                              value={state.occupation}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>--Occupation--</option>
                              {occupationsOptions}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td><label>Income</label></td>
                          <td>
                            <select
                              name="income"
                              value={state.income}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>--Income--</option>
                              {incomesOptions}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td><label>Age:</label></td>
                          <td>
                            <select
                              name="age"
                              value={state.age}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>--Age--</option>
                              {agesOptions}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td><label>FICO Score:</label></td>
                          <td><input
                            type="text"
                            name="FICO"
                            value={state.FICO}
                            onChange={handleChange}
                          /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="credit-card-container">
                    <table className="custom-table">
                      <tbody>
                        <tr>
                          <td>Notification Preference:</td>
                          <td>
                            <div className="list-container">
                              {notificationsList.map((item, index) => (
                                <div key={index}>
                                  <input value={item} name="notifications" type="checkbox" onChange={handleNotificationsCheck} />
                                  <span className={isNotificationChecked(item)}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><label>Categories:</label></td>
                          <td>
                            <div className="list-container">
                              {categoriesList.map((item, index) => (
                                <div key={index}>
                                  <input value={item} name="categories" type="checkbox" onChange={handleCategoryCheck} />
                                  <span className={isCategoryChecked(item)}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><label>Price (between 0 and 50):</label></td>
                          <td><input
                            type="text"
                            name="price"
                            value={state.price}
                            onChange={handleChange}
                          /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="credit-card-container">
                    <table className="custom-table">
                      <tbody>
                        <tr>
                          <td>Fee Preferences:</td>
                          <td>
                            <div className="list-container">
                              <select
                                name="fee_pref"
                                value={state.fee_pref}
                                onChange={handleChange}
                              >
                                <option value={""} disabled>--Fee Preference--</option>
                                {fee_prefOptions}
                              </select>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><label>Debt to Income Ratio:</label></td>
                          <td><input
                            type="text"
                            name="debt_income_ratio"
                            value={state.debt_income_ratio}
                            onChange={handleChange}
                          /></td>
                        </tr>
                        <tr>
                          <td>Bonus Options</td>
                          <td>
                            <select
                              name="bonus"
                              value={state.bonus}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>--Bonus Options--</option>
                              {bonusOptions}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td><label>Number of New Credit Cards in last 24 months:</label></td>
                          <td><input
                            type="text"
                            name="number_cc"
                            value={state.number_cc}
                            onChange={handleChange}
                          /></td>
                        </tr>
                          <tr>
                          <td><label>Monthly Breakdown:</label></td>
                          <td><input
                            type="text"
                            name="monthlyBalance"
                            value={state.monthlyBalance}
                            onChange={handleChange}
                          /></td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <LongButton onClick={handleClick}>Save preference</LongButton>
                    <LongButton onClick={handleClick}>Cancel</LongButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Preferences;