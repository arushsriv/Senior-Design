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
        // TODO: add to category, not replace
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

// Goals
const addGoal = async (db, username, goal) => {
    try {
        // Don't add it to user collection? 
        await db.collection('users').updateOne({ _id: username }, { $set: { goal: goal} });
        goal.username = username;
        if (!goal.hasOwnProperty('start_date')) {
            goal.start_date = Date.now()
        }

        const result = await db.collection('goals').insertOne(goal);
        return result;
    } catch (err) {
        throw new Error(`cannot add goal to user ${username}`);
    }
}

const getGoals = async (db, username) => {
    try {
        const results = await db.collection('goals').find({ username: username}).toArray();
        return results;
    } catch (err) {
        throw new Error(`cannot get goals for user ${username}`);
    }
}

// TODO test
// const deleteGoal = async (db, id) => {
//     try {
//         const result = await db.collection('goals').remove({ _id: id});
//         return result;
//     } catch (err) {
//         throw new Error(`cannot delete goal for user ${username}`);
//     }
// }

// TOOD enums for notification frequency, etc.
// TODO new collections for categories, etc.? 
// TODO add deleting for all

// Credit cards
const addCreditCard = async (db, username, credit_card) => {
    try {
        // TODO
        await db.collection('users').updateOne({ _id: username }, { $push: { credit_cards: credit_card} });
        credit_card.username = username;

        const result = await db.collection('credit_cards').insertOne(credit_card);
        return result;
    } catch (err) {
        throw new Error(`cannot add credit card for user ${username}`);
    }
}

const getCreditCards = async (db, username) => {
    try {
        const results = await db.collection('credit_cards').find({ username: username}).toArray();
        return results;
    } catch (err) {
        throw new Error(`cannot get credit cards for user ${username}`);
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
    addGoal,
    getGoals,
    // deleteGoal
    addCreditCard,
    getCreditCards
}; 

const main = async() => {

        const db = await connect('mongodb+srv://juliwang:seniordesign@cluster0.xrkdlnk.mongodb.net/?retryWrites=true&w=majority')

        const newUser = new Object(); 
        newUser.username = "juliawang"
        newUser.password = "password"
        newUser.first_name = "Julia"
        newUser.last_name = "Wang"
        newUser.email = "juliawang143@gmail.com"
        await addUser(db, newUser, newUser.username)

        const preferences = new Object();
        preferences.occupation = "SWE"
        preferences.income = "<$10,000"
        preferences.age = "18-25"
        preferences.categories = ["Transportation", "Rent"]
        preferences.notifications = "weekly"
        await addPreferences(db, newUser.username, preferences)

        // const categories = ["Food"]
        // await updateCategories(db, newUser.username, categories)

        const budget = {"transportation": 10000, "rent": 20000}
        await addBudget(db, newUser.username, budget)

        const newBudget = {"transportation": 20000, "rent": 10000}
        await updateBudget(db, newUser.username, newBudget)

        // Without start date
        // var target_date = new Date()
        // const goal = {"category": "travel", "target_date": target_date.setDate(target_date.getDate() + 10), "amount": 10000}
        // await addGoal(db, newUser.username, goal)

        // With start date
        var target_date = new Date()
        const goal = {"name": "Bali", "category": "travel", "start_date": target_date, "target_date": target_date.setDate(target_date.getDate() + 10), "amount": 10000}
        await addGoal(db, newUser.username, goal)

        // TODO add other fields such as fees, etc.
        const credit_card = {"name": "Platinum", "bank": "American Express"}
        await addCreditCard(db, newUser.username, credit_card)

        const credit_card_2 = {"name": "Freedom Unlimited", "bank": "Chase"}
        await addCreditCard(db, newUser.username, credit_card_2)

        

}; 
    
main();