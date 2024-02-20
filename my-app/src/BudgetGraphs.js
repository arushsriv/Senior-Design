import './App.css';

import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';

function BudgetGraphs() {
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
            <Link to={'/profile'}><button>My Profile</button> </Link>
            <br />
            <Link to={'/plaid'}><button>Connect with Plaid</button> </Link>
            <br />
            <Link to={'/budget'}><button>Budget</button></Link>
            <br />
            <button>Point Tracker</button>
            <Link to={'/card-offers'}><button>Credit Card Recommendations</button></Link>
          </ul>
        </nav>

        <div className="line-delimiter" />

        <section className="content">

          <div className="App">
            <div className="post-login-screen">
              <div className="gray-box2">
                <div className="credit-card-container">
                  <img src="/images/bar_chart.png" alt="Credit Card 1" className="budget-image" />
                  <img src="/images/line_chart.png" alt="Credit Card 2" className="budget-image" />
                  <img src="/images/pie_chart.png" alt="Credit Card 3" className="budget-image" />
                </div>

                <p>You have 10% left in your budget for the month</p>
                
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

export default BudgetGraphs;