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
    updateBudget
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

        const budget = {"transportation": "10,000", "rent": "20,000"}
        await addBudget(db, newUser.username, budget)

        const newBudget = {"transportation": "20,000", "rent": "10,000"}
        await updateBudget(db, newUser.username, newBudget)

}; 
    
main();
