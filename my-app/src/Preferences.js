import {useState} from "react";
import "./index.css";
import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';

function Preferences () {
  
  const [state, setState] = useState({
    fname: "",
    lname: "",
    message: "",
    future_goal: "",
    savings_goal: "",
    occupation: "",
    income: "",
    age: "",
    isChecked: false,
    categories: [],
    notifications: [],
    gender: "",
    price: 0
  });

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

  // TODO add more categories
  const categoriesList = ["Rent/utilities", "Transportation", "Groceries", "Eating out", "Travel", "Tuition", "Savings"];

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

  // Return classes based on whether item is checked
  var isCategoryChecked = (item) => state.categories.includes(item) ? "checked-item" : "not-checked-item";



  const notificationsList = ["Daily", "Weekly", "Biweekly", "Monthly"];


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

  // Generate string of checked items
  const notificationsItems = state.notifications.length
    ? state.notifications.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  // Return classes based on whether item is checked
  var isNotificationChecked = (item) => state.notifications.includes(item) ? "checked-item" : "not-checked-item";
  // Added

  const occupations = ["Doctor", "Lawyere"];

  const incomes = ["<$10,000", "$10,000 - $30,000", "$30,000 - $70,000", "$70,000 - $100,000", "$100,000 - $150,000", "$150,000+"];

  const ages = ["<18", "18 - 25", "25 - 35", "35 - 65", "65+"]

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

  const agesOptions = ages.map((age, key) => (
    <option value={age} key={key}>
      {age}
    </option>
  ));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(state);
  };

  return (
    
    <>
    <nav>
          <ul>
            <Link to={'/home'}><button>Home</button></Link>
            <br />
            <button>My Profile</button>
            <br />
            <Link to={'/budget'}><button>Budget</button></Link>
            <br />
            <button>Point Tracker</button>
            <Link to={'/card-offers'}><button>Credit Card Recommendations</button></Link>
          </ul>
        </nav>
        <div className="post-login-screen"> </div>
      <h1>Controlled Form</h1>
      
      <form onSubmit={handleSubmit}>
        {/* <label>
          First Name:{" "}
          <input
            type="text"
            name="fname"
            value={state.fname}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:{" "}
          <input
            type="text"
            name="lname"
            value={state.lname}
            onChange={handleChange}
          />
        </label>
        */}
        <label>
          Future Goal:{" "}
          <textarea
            name="future_goal"
            value={state.future_goal}
            onChange={handleChange}
          />
        </label> 
        <label>
          Savings Goal:{" "}
          <textarea
            name="savings_goal"
            value={state.savings_goal}
            onChange={handleChange}
          />
        </label> 
        <label>
          Occupation:
          <select
            name="occupation"
            value={state.occupation}
            onChange={handleChange}
          >
            <option value={""} disabled>
              --Occupation--
            </option>
            {occupationsOptions}
          </select>
        </label>
        <label>
          Income:
          <select
            name="income"
            value={state.income}
            onChange={handleChange}
          >
            <option value={""} disabled>
              --Income--
            </option>
            {incomesOptions}
          </select>
        </label>
        <label>
          Age:
          <select
            name="age"
            value={state.age}
            onChange={handleChange}
          >
            <option value={""} disabled>
              --Age--
            </option>
            {agesOptions}
          </select>
        </label>
        {/* Added */}
        <div className="list-container">
          {categoriesList.map((item, index) => (
            <div key={index}>
              <input value={item} name="categories" type="checkbox" onChange={handleCategoryCheck} />
              <span className={isCategoryChecked(item)}>{item}</span>
            </div>
          ))}
        </div>

        <div>
        {`Items checked are: ${categoriesItems}`}
        </div>

        <div className="list-container">
          {notificationsList.map((item, index) => (
            <div key={index}>
              <input value={item} name="notifications" type="checkbox" onChange={handleNotificationsCheck} />
              <span className={isNotificationChecked(item)}>{item}</span>
            </div>
          ))}
        </div>

        <div>
        {`Items checked are: ${notificationsItems}`}
        </div>
        {/* Added */}
        {/* TODO change notifications to radio buttons */}
        {/* <label>
          <input
            type="checkbox"
            name="isChecked"
            checked={state.isChecked}
            onChange={handleChange}
          />
          Is Checked?
        </label> */}
        {/* <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={state.gender === "male"}
            onChange={handleChange}
          />{" "}
          Male
        </label> */}
        {/* <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={state.gender === "female"}
            onChange={handleChange}
          />{" "}
          Female
        </label> */}
        <label>
          Price (between 0 and 50):
          <input
            type="range"
            name="price"
            min="0"
            max="50"
            value={state.price}
            onChange={handleChange}
          />
        </label>
        <button>Submit</button>
      </form>
      <h5>
        Name: {state.fname} {state.lname}
      </h5>
      <h5>Occupation: {state.occupation}</h5>
      <p>Message: {state.message}</p>
      <p>Future goal: {state.future_goal}</p>
      <p>Savings goal: {state.savings_goal}</p>
      <h5>Is it checked? : {state.isChecked ? "Yes" : "No"}</h5>
      <h5>Gender : {state.gender}</h5>
      <h5>Price : ${state.price}</h5>
    </>
  );
    // return (
    //     <div className="Preferences">
    //       <header className="Preferences-header">
    //         <img src={logo} className="Preferences-logo" alt="logo" />
    //         <p>
    //           Please input your personal spending habits and preferences for your budget below. 
    //         </p>
    //         <b >
    //           Budget
    //         </b>
    //       </header>
    //     </div>
    //   );
}

export default Preferences;