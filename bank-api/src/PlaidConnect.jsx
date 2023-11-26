import React, { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import "./PlaidConnect.scss";

function PlaidConnect(props) {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
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
      open();
    }
  }, [token, isOauth, ready, open]);
  
  return (
    <body>
      <div class='container'>
        <div class='header'>
          <h1>Step 1: Link your bank account(s) to Budgify!</h1>
          <p>Budgify uses Plaid to verify your bank account information and, periodically, your bank account balance to check if you have enough funds to cover certain transactions. If your bank is eligible for instant verification, you'll be prompted to add your online banking username and password (or other identifying information) after selecting your bank.</p>
        </div>
        <div class='center'>
          <button onClick={() => open()
            } disabled={!ready}>
            <strong>Click here to link your bank account</strong>
          </button>

          {!loading &&
            data != null &&
            Object.entries(data).map((entry, i) => (
              <pre key={i}>
                <code>{JSON.stringify(entry[1], null, 2)}</code>
              </pre>
            )
          )}
        </div>
      </div>
    </body>
  );
}

export default PlaidConnect;