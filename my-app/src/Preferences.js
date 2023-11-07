import logo from './logo.svg';
import React from "react";
import "./index.css";

function Preferences () {
    return (
        <div className="Preferences">
          <header className="Preferences-header">
            <img src={logo} className="Preferences-logo" alt="logo" />
            <p>
              Please input your personal spending habits and preferences for your budget below. 
            </p>
            <b >
              Budget
            </b>
          </header>
        </div>
      );
}

export default Preferences;