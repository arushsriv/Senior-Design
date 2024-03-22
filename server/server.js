require("dotenv").config();
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const cors = require("cors")

// import database functions
const lib = require('./dbOperations');
// declare the database object
let db;

// MongoDB URL
const url = 'mongodb+srv://juliwang:seniordesign@cluster0.xrkdlnk.mongodb.net/?retryWrites=true&w=majority'

app.use(cors())
app.use(
  // FOR DEMO PURPOSES ONLY
  // Use an actual secret key in production
  session({ secret: "bosco", saveUninitialized: true, resave: true })
);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Configuration for the Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

//Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

// app.get('/', (req, resp) => resp.json({ message: 'Welcome to Budgify!' }))

//Creates a Link token and return it
app.get("/api/create_link_token", async (req, res, next) => {
  try {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: req.sessionID },
      client_name: "Plaid's Tiny Quickstart",
      language: "en",
      products: ["auth"],
      country_codes: ["US"],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });
    res.json(tokenResponse.data);
  } catch (err) {
    return res.status(500).json({ error: `try again later with ${err}` });
  }
});

// Exchanges the public token from Plaid Link for an access token
app.post("/api/exchange_public_token", async (req, res, next) => {
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  // FOR DEMO PURPOSES ONLY
  // Store access_token in DB instead of session storage
  req.session.access_token = exchangeResponse.data.access_token;
  res.json(true);
});

// Fetches balance data using the Node client library for Plaid
app.get("/api/balance", async (req, res, next) => {
  const access_token = req.session.access_token;
  const balanceResponse = await client.accountsBalanceGet({ access_token });
  res.json({
    Balance: balanceResponse.data,
  });
});

// Fetches transactions using the Node client library for Plaid
app.get("/api/transactions", async (req, res, next) => {
  try {
    const access_token = req.session.access_token;
    const transactionResponse = await client.transactionsSync({ access_token });
    res.json({
      Transaction: transactionResponse.data,
    });
  } catch (err) {
    return resp.status(500).json({ error: `error: ${err}` });
  }
});

app.get('/home/:username', async (req, resp) => {
  if (!req.params.username) {
    return resp.status(404).json({ error: 'username not provided' });
  }
  try {
    const result = await lib.getUser(db, req.params.username);
    console.log(username);
    return resp.json({ message: `Welcome to Budgify ${username} !` })
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}` });
  }
});


// User
app.post('/adduser', async (req, resp) => {
  const newUser = new Object(); 
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  await lib.addUser(db, newUser, req.body.firstName); 
  return resp.status(201).json({ message: `User added with username ${req.body.firstName}` });
});


app.get('/getuser/:username', async (req, resp) => {
  if (!req.params.username) {
      return resp.status(404).json({ error: 'username not provided' });
  }
  try {
    const result = await lib.getUser(db, req.params.username);
    return resp.status(200).json({ data: result });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}` });
  }
});

// TODO update 

// Preferences
app.put('/addpreferences', async (req, resp) => {
  if (!req.body.username || !req.body.preferences || !req.body.preferences.occupation || 
    !req.body.preferences.age || !req.body.preferences.categories || !req.body.preferences.income
     || !req.body.preferences.notifications) {
    return resp.status(404).json({ error: 'not all data points inputted' });
  } try {
    await lib.addPreferences(db, req.body.username, req.body.preferences); 
    return resp.status(201).json({ message: `Preferences successfully added for user with username ${req.body.username}` });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}`});
  }
})

app.get('/getpreferences/:username', async (req, resp) => {
  if (!req.params.username) {
      return resp.status(404).json({ error: 'username not provided' });
  }
  try {
    const result = await lib.getPreferences(db, req.params.username);
    return resp.status(200).json({ data: result });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}` });
  }
});

// Categories
app.get('/getcategories/:username', async (req, resp) => {
  if (!req.params.username) {
      return resp.status(404).json({ error: 'username not provided' });
  }
  try {
    const result = await lib.getCategories(db, req.params.username);
    return resp.status(200).json({ data: result });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}` });
  }
});

app.post('/updatecategories', async (req, resp) => {
  if (!req.body.username || !req.body.categories) {
    return resp.status(404).json({ error: 'not all data points inputted' });
  } try {
    await lib.updateCategories(db, req.body.username, req.body.categories); 
    return resp.status(201).json({ message: `Categories successfully updated for user with username ${req.body.username}` });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}`});
  }
})

// Budget
app.get('/getbudget/:username', async (req, resp) => {
  if (!req.params.username) {
      return resp.status(404).json({ error: 'username not provided' });
  }
  try {
    const result = await lib.getBudget(db, req.params.username);
    return resp.status(200).json({ data: result });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}` });
  }
});

app.post('/addbudget', async (req, resp) => {
  if (!req.body.username || !req.body.budget) {
    return resp.status(404).json({ error: 'not all data points inputted' });
  } try {
    await lib.addBudget(db, req.body.username, req.body.budget); 
    return resp.status(201).json({ message: `Budget successfully submitted for user with username ${req.body.username}` });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}`});
  }
})

app.post('/updatebudget', async (req, resp) => {
  if (!req.body.username || !req.body.budget) {
    return resp.status(404).json({ error: 'not all data points inputted' });
  } try {
    await lib.updateBudget(db, req.body.username, req.body.budget); 
    return resp.status(201).json({ message: `Budget successfully updated for user with username ${req.body.username}` });
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}`});
  }
})

// Get top 5 amounts per category item endpoint
app.get('/top5/:month', async (req, res) => {
  try {

    const desiredMonth = new Date(req.params.month); // Assuming req.params.month is a string like '2024-02-01'
    const top5Data = await lib.getTop5AmountsPerCategoryItem(db, desiredMonth);

    res.json({ top5Data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Predict spending with budget endpoint
app.post('/predict', async (req, res) => {
  try {

    const desiredMonth = new Date(req.body.desiredMonth); // Assuming req.body.desiredMonth is a string like '2024-02-01'
    const overallBudget = req.body.overallBudget || 400; // Default overall budget to 400 if not provided
    const predictions = await lib.predictSpendingWithBudget(db, desiredMonth, overallBudget);

    res.json({ predictions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.post('/analyzeCreditCards', async (req, res) => {
  try {
      const {
          debtToIncomeRatio,
          averageTotalMonthlyBalance,
          newCards,
          annualFeePreference,
          bonusWeight,
          annualFeeLimit,
          ficoScore,
          highSpendingCategories,
          preferredStoresTravelPartners,
      } = req.body;

      const result = await analyzeCreditCards(
          debtToIncomeRatio,
          averageTotalMonthlyBalance,
          newCards,
          annualFeePreference,
          bonusWeight,
          annualFeeLimit,
          ficoScore,
          highSpendingCategories,
          preferredStoresTravelPartners
      );

      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/save-preferences', async (req, res) => {
  const preferencesData = req.body;

  // Assuming you have a unique identifier for the user (e.g., username)
  const username = 'riakul'; // Change this to the actual username

  // Call the async function to save preferences
  const result = await lib.savePreferences(preferencesData, username);

  // Send the result as JSON response
  res.json(result);
});

app.post('/getTopCreditCards', async (req, res) => {
  try {
    const result = await lib.getTopCreditCards(db, req);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = 8080;

// app.listen(process.env.PORT || 8080);

// start the app and connect to the DB
app.listen(port, async () => {
  db = await lib.connect(url);
  console.log(`Express server running on port:${port}`);
});