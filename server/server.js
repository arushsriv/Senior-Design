const express = require('express')
const app = express()

const bodyParser = require('body-parser');

const cors = require("cors")

// import database functions
const lib = require('./dbOperations');
// declare the database object
let db;

// MongoDB URL
const url = 'mongodb+srv://juliwang:seniordesign@cluster0.xrkdlnk.mongodb.net/?retryWrites=true&w=majority'

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, resp) => resp.json({ message: 'Welcome to Budgify!' }));

// User
app.post('/adduser', async (req, resp) => {
  if (!req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name || !req.body.email ) {
      return resp.status(404).json({ error: 'not all fields filled out!' });
  } try {
      const newUser = new Object(); 
      newUser._id = req.body.username;
      newUser.password = req.body.password;
      newUser.first_name = req.body.first_name;
      newUser.last_name = req.body.last_name;
      newUser.email = req.body.email;
      await lib.addUser(db,  newUser, req.body.username); 
      return resp.status(201).json({ message: `User added with username ${req.body.username}` });
  } catch (err) {
      return resp.status(500).json({ error: `try again later with ${err}`});
  }
})

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

const port = 8000;

// start the app and connect to the DB
app.listen(port, async () => {
  db = await lib.connect(url);
  console.log(`Express server running on port:${port}`);
});