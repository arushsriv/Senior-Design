// import { username } from '../Login.js';

const { MongoClient } = require('mongodb');

const connect = async (url) => {
    try {
        const con = (await MongoClient.connect(url, {
            useNewUrlParser: true, useUnifiedTopology: true})).db();
            console.log("Connected to database");
            return con;
    } catch (err) {
        throw new Error(`cannot connect to the database with ${err}`);
    }
}; 

// User
const addUser = async (db, newUser, username) => {
    newUser._id = username;
    try {
        const result = await db.collection('users').insertOne(newUser);
        return result;
    } catch (err) {
        throw new Error('cannot add new user');
    }
}

async function home(db, username) {
    try {
        const result = await db.collection('users').findOne({_id: username});
        return result;
    } catch (err) {
        throw new Error(`cannot get user with ${err}`);
    }
}

async function getUser(db, username) {
    try {
        const result = await db.collection('users').findOne({ _id: username});
        return result;
    } catch (err) {
        throw new Error(`cannot get user with ${err}`);
    }
}

// Preferences
const addPreferences = async (db, username, preferences) => {
    try {
        await db.collection('users').updateOne({ _id: username }, { $set: { preferences: preferences} });
    } catch (err) {
        throw new Error(`cannot add preferences to user ${username}`);
    }
}

const getPreferences = async (db, username) => {
    try {
        const result = await getUser(db, username);
        return result.preferences;
    } catch (err) {
        throw new Error(`cannot get preferences for user ${username}`);
    }
}

// Categories
const updateCategories = async (db, username, categories) => {
    try {
        await db.collection('users').updateOne({_id: username}, {$set: {'preferences.categories': categories}});
    } catch (err) {
        throw new Error(`cannot update categories for user ${username}`);
    }
}

const getCategories = async (db, username) => {
    try {
        const result = await getUser(db, username);
        return result.preferences.categories;
    } catch (err) {
        throw new Error(`cannot get categories for user ${username}`);
    }
}

// Budget
const getBudget = async (db, username) => {
    try {
        const result = await getUser(db, username);
        return result.budget;
    } catch (err) {
        throw new Error(`cannot get budget for user ${username}`);
    }
}

const addBudget = async (db, username, budget) => {
    try {
        await db.collection('users').updateOne({ _id: username }, { $set: { budget: budget} });
    } catch (err) {
        throw new Error(`cannot add budget to user ${username}`);
    }
}

const updateBudget = async (db, username, budget) => {
    try {
        await db.collection('users').updateOne({_id: username}, {$set: {'budget': budget}});
    } catch (err) {
        throw new Error(`cannot update budget for user ${username}`);
    }
}
async function getTop5AmountsPerCategoryItem(db, desiredMonth) {
  const transactionsCollection = db.collection('transactions');

  const top5PerCategoryItem = await transactionsCollection.aggregate([
    {
      $addFields: {
        transaction_date: {
          $cond: {
            if: { $eq: [{ $type: '$transaction_date' }, 'string'] },
            then: { $toDate: '$transaction_date' },
            else: '$transaction_date',
          },
        },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $year: '$transaction_date' }, desiredMonth.getFullYear()] },
            { $eq: [{ $month: '$transaction_date' }, desiredMonth.getMonth() + 1] },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          Category: '$Category',
          Description: '$Description',
        },
        transactions: { $push: '$$ROOT' },
      },
    },
    {
      $project: {
        _id: 0,
        Category: '$_id.Category',
        Description: '$_id.Description',
        transactions: '$transactions',
        combo: { $concat: ['$_id.Category', ' - ', '$_id.Description'] }, // Unique combination of Category and Description
      },
    },
    {
      $group: {
        _id: '$Category',
        categoryData: { $push: '$$ROOT' },
      },
    },
    {
      $project: {
        _id: 0,
        Category: '$_id',
        transactions: {
          $slice: ['$categoryData.transactions', 5], // Get the top 5 transactions per category
        },
      },
    },
  ]).toArray();

  console.log(top5PerCategoryItem);

  return top5PerCategoryItem;
}


  
  async function predictSpendingWithBudget(db, desiredMonth, overallBudget, scalingFactor = 0.8) {
    const transactionsCollection = db.collection('transactions');
  
    // Convert desiredMonth to a MongoDB query
    const monthQuery = {
      $eq: [{ $month: '$transaction_date' }, desiredMonth.getMonth() + 1], // Months are zero-based in JavaScript Date object
    };
  
    // Filter transactions based on the desired month
    const monthlySpending = await transactionsCollection
      .aggregate([
        {
          $match: { transaction_date: monthQuery },
        },
        {
          $group: {
            _id: '$Category',
            totalDebit: { $sum: '$Debit' },
          },
        },
      ])
      .toArray();
  
    // Train a linear regression model for each category
    const models = {};
    for (const categoryData of monthlySpending) {
      const category = categoryData._id;
      const categoryDataPoints = await transactionsCollection
        .aggregate([
          {
            $match: { Category: category },
          },
          {
            $group: {
              _id: { $month: '$transaction_date' },
              totalDebit: { $sum: '$Debit' },
            },
          },
        ])
        .toArray();
  
      const X = categoryDataPoints.map((dataPoint) => [dataPoint._id]); // Months
      const y = categoryDataPoints.map((dataPoint) => dataPoint.totalDebit / overallBudget); // Normalize to percentage of overall budget
  
      const net = new brain.recurrent.GRUTimeStep();
      net.train(X, y);
  
      models[category] = net;
    }
  
    // Make predictions for the desired month with the scaling factor
    const predictions = {};
    for (const [category, model] of Object.entries(models)) {
      const XDesired = [desiredMonth.getMonth() + 1]; // Months
      const predictedPercentage = model.run(XDesired)[0];
      const scaledPrediction = Math.max(predictedPercentage * scalingFactor, 0.0); // Set a minimum value of 0
      predictions[category] = scaledPrediction * overallBudget; // Convert back to actual spending
    }
  
    const output = {};
    for (const [category, prediction] of Object.entries(predictions)) {
      output[category] = parseFloat(prediction.toFixed(2));
    }
  
    return output;
  }

  async function analyzeCreditCards(debtToIncomeRato, averageTotalMonthlyBalance, newCards, 
    annualFeePreference, bonusWeight, annualFeeLimit, ficoScore, 
    highSpendingCategories, preferredStoresTravelPartners) {

    try {
        const creditCardsCollection = db.collection(credit_cards);

        // Fetch data directly from MongoDB
        const cursor = await creditCardsCollection.find({});
        const creditCardsData = await cursor.toArray();

        const creditCardsDataFrame = new DataFrame(creditCardsData);

        creditCardsDataFrame.set('cardMonthAvg', creditCardsDataFrame.get('offerSpend').div(creditCardsDataFrame.get('offerDays')));

        // Filter credit cards based on user preferences
        const filteredCards = creditCardsDataFrame.filter(
            (row) => (annualFeePreference ? row.get('annualFee') <= annualFeeLimit : row.get('annualFee')) &&
                     row.get('cardMonthAvg') < averageTotalMonthlyBalance &&
                     row.get('scoreMin') < ficoScore &&
                     row.get('isBusiness') !== 'TRUE'
        );

        const addVals = creditCardsDataFrame.loc[creditCardsDataFrame.get('offerSpend').eq(0)];
        const concatenatedCards = addVals.concat(filteredCards);

        // Calculate scores
        concatenatedCards.set('score', concatenatedCards.get('offerAmount').mul(bonusWeight) +
                                     concatenatedCards.get('universalCashbackPercent').mul(1 - bonusWeight));

        // Get top 3 cards
        const topCards = concatenatedCards.sort('score', 'desc').head(3);

        // Return the top 3 ideal credit cards
        return topCards.get(['name', 'issuer', 'offerAmount', 'offerSpend', 'offerDays',
                             'universalCashbackPercent', 'annualFee', 'url', 'imageUrl']).toJSON();
    } finally {
    }
}


// TOOD enums for notification frequency, etc.

module.exports = {
    connect,
    addUser,
    getUser,
    addPreferences,
    getPreferences,
    getCategories,
    updateCategories,
    getBudget,
    addBudget,
    updateBudget,
    home,
    getTop5AmountsPerCategoryItem,
    predictSpendingWithBudget,
    analyzeCreditCards
}; 

const main = async() => {
    
    // const db = await connect('mongodb+srv://juliwang:seniordesign@cluster0.xrkdlnk.mongodb.net/?retryWrites=true&w=majority')
    
    // const newUser = new Object();
    // newUser.username = "julia";
    // newUser.password = "password";
    // newUser.first_name = "Julia"
    // newUser.last_name = "Wang"
    // newUser.email = "juliawang143@gmail.com"
    // await addUser(db, newUser, newUser.username)

    // const preferences = new Object();
    // preferences.occupation = "SWE"
    // preferences.income = "<$10,000"
    // preferences.age = "18-25"
    // preferences.categories = ["Transportation", "Rent"]
    // preferences.notifications = "weekly"
    // await addPreferences(db, newUser.username, preferences)

    // const categories = ["Food"]
    // await updateCategories(db, newUser.username, categories)

    // const budget = {"transportation": "10,000", "rent": "20,000"}
    // await addBudget(db, newUser.username, budget)

    // const newBudget = {"transportation": "20,000", "rent": "10,000"}
    // await updateBudget(db, newUser.username, newBudget)
}; 
    
main();
