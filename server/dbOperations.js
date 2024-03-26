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

const getUser = async (db, username) => {
  try {
    const user = await db.collection('users').findOne({ _id: username});
    return user; 
  } catch (err) {
    console.error("Error in getUserFromDatabase:", err); 
    throw err; 
  }
}

const savePreferences = async (db, preferencesData) => {
  try {
    // Find the user by username and update preferences
    const result = await db.collection('preferences').insertOne(preferencesData);
    //   { username: username },
    //   { $set: preferencesData },
    //   { upsert: true }
    // );

    console.log('Preferences saved successfully:', result);
    // return { success: true, message: 'Preferences saved successfully' };
    return result; 
  } catch (error) {
    throw new Error('cannot add new user');
    // console.error('Error saving preferences:', error);
    // return { success: false, message: 'Error saving preferences' };
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

// Preferences
const addPreferences = async (db, username, preferences) => {
    try {
        await db.collection('users').updateOne({ _id: username }, { $set: { preferences: preferences} });
    } catch (err) {
        throw new Error(`cannot add preferences to user ${username}`);
    }
}

const getPreferences = async (db, user) => {
    try {
        const result = db.collection('preferences').findOne({username: user});
        console.log("get preference result: ", result);
        return result;
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
async function getTop5AmountsPerCategoryItem(db, desiredMonth, user) {
  const transactionsCollection = db.collection('transactions');
  console.log("user db: ", user);

  const top5PerCategoryItem = await transactionsCollection.aggregate([
    {
      $match: {
        username: user, // Filter transactions by the logged-in user
        transaction_date: {
          $gte: new Date(desiredMonth.getFullYear(), desiredMonth.getMonth(), 1).toISOString().split('T')[0], // Start of the desired month
          $lt: new Date(desiredMonth.getFullYear(), desiredMonth.getMonth() + 1, 1).toISOString().split('T')[0], // Start of the next month
        },
      },
    },
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




async function getTopCreditCards(db, req) {
  // User input variables
  const {
    debtToIncomeRatio,
    newCards,
    annualFeePreference,
    annualFeeLimit,
    bonusWeight,
    averageTotalMonthlyBalance,
    ficoScore,
    highSpendingCategories,
    preferredStoresTravelPartners,
  } = req.body;
  console.log('req.body db: ', req.body);

  console.log("bonusWiehgt: ", bonusWeight);
  console.log("req.body.bonusWeight: ", req.body.bonusWeight);
  try {
    if (isNaN(bonusWeight)) {
      throw new Error("Input is null");
    }
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

// cc
const addCc = async (db, username) => {
  if (username == 'arushis') {
    console.log("user is arushis");
    try {
      const ccInfo = [
        {
          cc_name: "Platinum (Morgan Stanley)",
          cc_issuer: "AMERICAN_EXPRESS",
          cc_network: "AMERICAN_EXPRESS",
          cc_currency: "AMERICAN_EXPRESS",
          cc_url: "https://apply.americanexpress.com/amex-morgan-stanley-credit-cards/?page_url=1",
          cc_imageurl: "https://offeroptimist.com/images/amex/platinum-morgan-stanley.webp"
        }, {
          cc_name: "Secured",
          cc_issuer: "CITI",
          cc_network: "MASTERCARD",
          cc_currency: "AMERICAN",
          cc_url: "https://www.citi.com/credit-cards/citi-secured-credit-card",
          cc_imageurl: "https://www.citi.com/CRD/images/citi-secured-card/citi-secured-card_222x140.png"
        }, {
          cc_name: "AARP Essential Rewards",
          cc_issuer: "BARCLAYS",
          cc_network: "MASTERCARD",
          cc_currency: "USD",
          cc_url: "https://cards.barclaycardus.com/banking/cards/aarp-essential-rewards-mastercard/",
          cc_imageurl: "https://offeroptimist.com/images/barclays/aarp-essential-rewards.png"
        }
      ];
      const result = await db.collection('users').updateOne(
        { _id: username },
        { $set: { credit_cards: ccInfo } }
      );
      return result; 
    } catch (err) {
      throw new Error('Cannot update user with cc info');
    }
  } else if (username == 'jwang') {
    try {
      const ccInfo = [
        {
          cc_name: "Everyday",
          cc_issuer: "AMERICAN_EXPRESS",
          cc_network: "AMERICAN_EXPRESS",
          cc_currency: "AMERICAN_EXPRESS",
          cc_url: "https://www.americanexpress.com/us/credit-cards/card/amex-everyday/",
          cc_imageurl: "https://offeroptimist.com/images/amex/everyday.png"
        }, {
          cc_name: "Blue Cash Preferred",
          cc_issuer: "AMERICAN_EXPRESS",
          cc_network: "AMERICAN_EXPRESS",
          cc_currency: "USD",
          cc_url: "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/",
          cc_imageurl: "https://offeroptimist.com/images/amex/blue-cash-preferred.webp"
        }, {
          cc_name: "Premium Rewards Elite",
          cc_issuer: "BANK_OF_AMERICA",
          cc_network: "VISA",
          cc_currency: "BANK_OF_AMERICA",
          cc_url: "https://www.bankofamerica.com/credit-cards/products/premium-rewards-elite-credit-card/",
          cc_imageurl: "https://offeroptimist.com/images/bankofamerica/premium-rewards-elite.png"
        }
      ];
      const result = await db.collection('users').updateOne(
        { _id: username },
        { $set: { credit_cards: ccInfo } }
      );
      return result; 
    } catch (err) {
      throw new Error('Cannot update user with cc info');
    }
  } else if (username == 'riakul') {
    try {
      const ccInfo = [
        {
          cc_name: "Sapphire Reserve",
          cc_issuer: "CHASE",
          cc_network: "VISA",
          cc_currency: "CHASE",
          cc_url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
          cc_imageurl: "https://offeroptimist.com/images/chase/sapphire-reserve.png"
        }, {
          cc_name: "Platinum Plus",
          cc_issuer: "BANK_OF_AMERICA",
          cc_network: "MASTERCARD",
          cc_currency: "USD",
          cc_url: "https://www.bankofamerica.com/smallbusiness/credit-cards/products/platinum-plus-business-credit-card/?campaign=4053445~YT~en_US",
          cc_imageurl: "https://offeroptimist.com/images/bankofamerica/platinum-plus.webp"
        }, {
          cc_name: "Green",
          cc_issuer: "AMERICAN_EXPRESS",
          cc_network: "AMERICAN_EXPRESS",
          cc_currency: "AMERICAN_EXPRESS",
          cc_url: "https://www.americanexpress.com/us/credit-cards/card/green/",
          cc_imageurl: "https://offeroptimist.com/images/amex/green.webp"
        }
      ];
      const result = await db.collection('users').updateOne(
        { _id: username },
        { $set: { credit_cards: ccInfo } }
      );
      return result; 
    } catch (err) {
      throw new Error('Cannot update user with cc info');
    }
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
    addCc,
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
