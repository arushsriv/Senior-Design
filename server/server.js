require("dotenv").config();
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const cors = require("cors")
const bcrypt = require('bcrypt');

// import database functions
const lib = require('./dbOperations');
// declare the database object
let db;

// MongoDB URL
const url = 'mongodb+srv://juliwang:seniordesign@cluster0.xrkdlnk.mongodb.net/?retryWrites=true&w=majority'

// app.use(cors())
app.use(cors({
  origin: 'http://localhost:3000', // replace with your client's origin
  credentials: true
}));
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
    return resp.json({ message: `Welcome to Budgify ${username} !` })
  } catch (err) {
    return resp.status(500).json({ error: `try again later with ${err}` });
  }
});

// hardcode credit card
app.post('/addcc', async (req, resp) => {
  const username = req.body.username;
  console.log(username);
  if (username == 'arushis') {
    await lib.addCc(db, username); 
    return resp.status(200).json({ message: 'Credit card info updated for user ', user: req.session.user });
  } else if (username == 'jwang') {
    await lib.addCc(db, username); 
    return resp.status(200).json({ message: 'Credit card info updated for user ', user: req.session.user });
  } else if (username == 'riakul') {
    await lib.addCc(db, username); 
    return resp.status(200).json({ message: 'Credit card info updated for user ', user: req.session.user });
  }
});

app.post('/save-preferences', async (req, res) => {
  const preferencesData = req.body;

  // Assuming you have a unique identifier for the user (e.g., username)
  const username = preferencesData.username; 

  // Call the async function to save preferences
  await lib.savePreferences(db, preferencesData);

  // Send the result as JSON response
  // res.json(result);
  return res.status(201).json({ message: 'Saved preferences for user: ', username });
});

// User
app.post('/adduser', async (req, resp) => {
  const newUser = new Object(); 
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); 
  newUser._id = req.body.username; 
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = hashedPassword;
  await lib.addUser(db, newUser, req.body.username); 
  req.session.user = { 
    username: req.body.username, 
    email: req.body.email,
    firstName: req.body.firstName, 
    lastName: req.body.lastName
  };
  return resp.status(201).json({ message: 'Registration successful', user: req.session.user });
});

// login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await lib.getUser(db, username); 
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      // store user info in session
      req.session.user = { 
        username: user.username, 
        email: user.email,
        firstName: user.firstName, 
        lastName: user.lastName,
        credit_cards: user.credit_cards
      };
      res.json({ message: "Login successful", user: req.session.user });
    } else {
      // invalid password
      console.log("Invalid Password");
      res.status(401).json({ error: "Invalid Password" });
    }
  } else {
    // user not found
    console.log("User not found");
    res.status(401).json({ error: "User not found" });
  }
});

// session
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user); 
  } else {
    console.log(req.session.user);
    res.status(401).json({ error: "Not logged in" });
  }
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
app.get('/top5/:username/:month', async (req, res) => {
  console.log('in here')
  try {
    // Log the request parameters for debugging
    console.log('Request parameters:', req.params);

    const desiredMonth = new Date(req.params.month); // Assuming req.params.month is a string like '2024-02-01'
    const user = req.params.username;

    // Log the desired month and username for debugging
    console.log('Desired month:', desiredMonth);
    console.log('Username:', user);

    const top5Data = await lib.getTop5AmountsPerCategoryItem(db, desiredMonth, user);

    // Log the retrieved top5Data for debugging
    console.log('Top 5 data:', top5Data);

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