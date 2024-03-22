import React, { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import './App.css';
import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import Navigation from './components/Menu';
import Footer from './components/Footer';

function Plaid(props) {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const onSuccess = useCallback(async (publicToken) => {
    setLoading(true);
    await fetch("/api/exchange_public_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    await getBalance();
    // await getTransactioins(); 
    await fetchCustomTransactions();
  }, []);

  // Creates a Link token
  const createLinkToken = React.useCallback(async () => {
    // For OAuth, use previously generated Link token
    if (window.location.href.includes("?oauth_state_id=")) {
      const linkToken = localStorage.getItem('link_token');
      setToken(linkToken);
    } else {
      const response = await fetch("/api/create_link_token", {});
      const data = await response.json();
      setToken(data.link_token);
      localStorage.setItem("link_token", data.link_token);
    }
  }, [setToken]);

  // Fetch balance data 
  const getBalance = React.useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/balance", {});
    const data = await response.json();
    setData(data);
    setLoading(false);
  }, [setData, setLoading]);

  const fetchCustomTransactions = async () => {
    try {
      const response = await fetch('/csvjson.json');
      const data = await response.json(); 
      setTransaction(data); 
    } catch (error) {
      console.error("Error fetching custom transactions:", error); 
    }
  };

   // Fetch transactions
  //  const getTransactioins = React.useCallback(async () => {
  //   setLoading(true);
  //   const response = await fetch("/api/transactions", {});
  //   const transaction = await response.json();
  //   setTransaction(transaction);
  //   setLoading(false);
  // }, [setTransaction, setLoading]);

  let isOauth = false;

  const config = {
    token,
    onSuccess,
  };

  // For OAuth, configure the received redirect URI
  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (token == null) {
      createLinkToken();
    }
    if (isOauth && ready) {
      console.log('clicked');
      open();
    }
  }, [token, isOauth, ready, open]);

  console.log(data);
  console.log(transaction);
  
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
                <div className="gray-box">
                <h1>Link your bank account(s) to Budgify!</h1>
                <p>Budgify uses Plaid to verify your bank account information and, periodically, your bank account balance to check if you have enough funds to cover certain transactions. If your bank is eligible for instant verification, you'll be prompted to add your online banking username and password (or other identifying information) after selecting your bank.</p>
                <button data-testid="submitButton" className="connectButton" type="submit" onClick={() => open()
                  } disabled={!ready}>
                  <strong>Click here to link your bank account</strong>
                </button>
                <br />
                {!loading && data && data.Balance && data.Balance.accounts && 
                  <div>
                    <p>These are your accounts linked with Budigfy:</p>
                    {data.Balance.accounts.map((account, i) => (
                      <div key={i}>{account.name}</div>
                    ))}
                  </div>
                }
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

export default Plaid;