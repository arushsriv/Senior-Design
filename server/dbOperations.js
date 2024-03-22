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
const addUser = async (db, newUser) => {
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




const savePreferences = async (preferencesData, username) => {
  try {
    // Find the user by username and update preferences
    const result = await db.collection('users').updateOne(
      { username: username },
      { $set: preferencesData },
      { upsert: true }
    );

    console.log('Preferences saved successfully:', result);
    return { success: true, message: 'Preferences saved successfully' };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, message: 'Error saving preferences' };
  }
};

async function getTopCreditCards(db, req) {
  // User input variables
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

  try {
    if (isNaN(bonusWeight) || bonusWeight < 0 || bonusWeight > 1) {
      throw new Error("Input is not a valid number between 0 and 1.");
    }
  } catch (error) {
    return { error: error.message };
  }

  if (debtToIncomeRatio > 0.5) {
    return {
      error: "Due to your high debt to income ratio, we recommend focusing on your budgeting before getting a new card. Check out the budgeting tab of our website for more tips.",
    };
  }

  if (newCards > 4) {
    return {
      error: "According to the Chase 5/24 Rule, you shouldn't create more than 5 new credit card accounts within 24 months. Consider waiting a couple of months before applying for your next card to avoid hurting your credit score.",
    };
  }

  try {
    // Simulate an asynchronous operation (e.g., fetching data from MongoDB)
    // Replace this with actual asynchronous operations as needed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assuming you have credit card data as an array
    let creditCardsData = await db.collection('credit_cards').find().toArray();

    // Filter credit cards based on user preferences
    let filteredCards = creditCardsData.filter(card =>
      (card.annualFee <= annualFeeLimit || !annualFeePreference) &&
      (card.card_month_avg < averageTotalMonthlyBalance) &&
      (card.score_min < ficoScore) &&
      (card.isBusiness !== 'TRUE')
    );

    // Assuming you have credit card data as an array
    let addVals = creditCardsData.filter(card => card.offerSpend === 0);
    filteredCards = addVals.concat(filteredCards);

    // Sort cards based on a scoring mechanism (custom logic based on user preferences)
    filteredCards.forEach(card => {
      card.score = card.offerAmount * bonusWeight + card.universalCashbackPercent * (1 - bonusWeight);
    });

    // Get top 3 cards
    let topCards = filteredCards.sort((a, b) => b.score - a.score).slice(0, 3);

    // Remove circular references before sending the response
    const cleanTopCards = topCards.map(card => ({ ...card, _id: card._id.toString() }));

    // Return the top 3 ideal credit cards
    return { topCards: cleanTopCards };
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
}

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
    savePreferences,
    getTopCreditCards
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
