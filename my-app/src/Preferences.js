import './App.css';

import React, { useState } from 'react';

import './/css/PostLoginScreen.css';
// import { Link } from 'react-router-dom';
import LongButton from './components/LogButton';
import Navigation from './components/Menu';
import Footer from './components/Footer';
// Samples are in this URL https://react-chartjs-2.js.org/examples/pie-chart

function Preferences() {

  // const [loggedInUser] = useState('riakul');
  const occupations = ["Doctor", "Lawyer", "Engineer", "Teacher", "Other"];
  const incomes = ["<$10,000", "$10,000 - $30,000", "$30,000 - $70,000", "$70,000 - $100,000", "$100,000 - $150,000", "$150,000+"];
  const ages = ["<18", "18 - 25", "25 - 35", "35 - 65", "65+"];
  const fee_pref = ["Yes", "No"];
  const debt_income_ratio = ["<0.5", ">0.5"];
  const bonus = ["Only bonus deals", "long term points"];
  const number_cc = ["<4", ">4"]
  const categoriesList = ["Rent/utilities", "Transportation", "Groceries", "Eating out", "Travel", "Tuition", "Savings"];
  // Return classes based on whether item is checked
  var isCategoryChecked = (item) => state.categories.includes(item) ? "checked-item" : "not-checked-item";
  const notificationsList = ["Daily", "Weekly", "Biweekly", "Monthly"];
  // Return classes based on whether item is checked
  var isNotificationChecked = (item) => state.notifications.includes(item) ? "checked-item" : "not-checked-item";
  // Added

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
    debt_income_ratio_op: "",
    isChecked: false,
    categories: [],
    notifications: [],
    gender: "",
    price: 0,
    fee_pref: "",
    debt_income_ratio: 0,
    bonus: "",
    number_cc: ""
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

  const debt_income_ratiosOptions = debt_income_ratio.map((debt_income_ratio, key) => (
    <option value={debt_income_ratio} key={key}>
      {debt_income_ratio}
    </option>
  ));

  const bonusOptions = bonus.map((bonus, key) => (
    <option value={bonus} key={key}>
      {bonus}
    </option>
  ));

  const number_ccOptions = number_cc.map((number_cc, key) => (
    <option value={number_cc} key={key}>
      {number_cc}
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
    console.log("eeee")
    console.log(e.target.name)
    setState((state) => ({
      ...state,
      [e.target.name]: value
    }));
  };

  /**
   * Handle Click will save the data into the database
   */
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="layout">
      <header className="headerAppName">
        <h1 >Budgify</h1>
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
                            <td><select
                              name="occupation"
                              value={state.occupation}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>
                                --Occupation--
                              </option>
                              {occupationsOptions}
                            </select></td>
                          </tr>
                          <tr>
                            <td><label>Income</label></td>
                            <td><select
                              name="income"
                              value={state.income}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>
                                --Income--
                              </option>
                              {incomesOptions}
                            </select></td>
                          </tr>
                          <tr>
                            <td><label>Age:</label></td>
                            <td><select
                              name="age"
                              value={state.age}
                              onChange={handleChange}
                            >
                              <option value={""} disabled>
                                --Age--
                              </option>
                              {agesOptions}
                            </select></td>
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
                            <td> <div className="list-container">
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
                              type="range"
                              name="price"
                              min="0"
                              max="50"
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
                            <td> <div className="list-container">
                              <select
                                name="fee_pref"
                                value={state.fee_pref}
                                onChange={handleChange}
                              >
                                <option value={""} disabled>
                                  --Fee Preference--
                                </option>
                                {fee_prefOptions}
                              </select>
                            </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Debt income ratio</td>
                            <td>
                              <select
                                name="debt_income_ratio"
                                value={state.debt_income_ratio}
                                onChange={handleChange}
                              >
                                <option value={""} disabled>
                                  --Debt to Income Ratio--
                                </option>
                                {debt_income_ratiosOptions}
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td>Bonus Options</td>
                            <td>
                              <select
                                name="bonus"
                                value={state.bonus}
                                onChange={handleChange}
                              >
                                <option value={""} disabled>
                                  --Bonus Options--
                                </option>
                                {bonusOptions}
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td>Number CC</td>
                            <td>
                              <select
                                name="number_cc"
                                value={state.number_cc}
                                onChange={handleChange}
                              >
                                <option value={""} disabled>
                                  --Number CC--
                                </option>
                                {number_ccOptions}
                              </select>
                            </td>
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
           <Footer/>                         
      </div>
    </div>
  );
}

export default Preferences;