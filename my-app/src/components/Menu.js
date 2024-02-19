import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <div className="scrolling-list-container">
        <ul className="scrolling-list">
          <li>
            <Link to={'/home'} style={{ textDecoration: 'none' }}><b>Home</b></Link>
            <br />
          </li>
          <li>
            <Link to={'/profile'} style={{ textDecoration: 'none' }}><b>Profile</b></Link>
            <br />
          </li>
          <li>
            <Link to={'/budget'} style={{ textDecoration: 'none' }}><b>Budget</b></Link>
            <br />
          </li>
          <li>
            <Link to={'/preferences'} style={{ textDecoration: 'none' }}><b>Preferences</b></Link>
            <br />
          </li>
          <li>
            <Link to={'/card-offers'} style={{ textDecoration: 'none' }}><b>Credit Card Recommendations</b></Link>
            <br />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
