const express = require('express');
const { MongoClient } = require('mongodb');

const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());


// Enable CORS for your Chrome extension (extension ID)
app.use(cors({
    origin: 'chrome-extension://ggffibafebnmkglggpdhglhacpmimdkg'
  }));

let db;


const uri = 'mongodb+srv://juliwang:seniordesign@cluster0.xrkdlnk.mongodb.net/?retryWrites=true&w=majority'

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(uri);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getuser/:username', async (req, resp) => {
    await client.connect();
    db = client.db("test")
    if (!req.params.username) {
        return resp.status(404).json({ error: 'username not provided' });
    }
    try {
      const result = await getUser(db, req.params.username);
      return resp.status(200).json({ data: result });
    } catch (err) {
        console.log("pppp")
      return resp.status(500).json({ error: `try again later with ${err}` });
    }
});  

async function getUser(db, username) {
    try {
        const result = await db.collection('users').findOne({ _id: username});
        return result;
    } catch (err) {
        throw new Error(`cannot get user with ${err}`);
    }
}

app.post('/login', async (req, res) => {
    console.log("request")
    console.log(req.body)
    // TODO added
    await client.connect();
    db = client.db("test")
    // TODO added

    const { username, password } = req.body;
    const user = await getUser(db, username); 
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        // store user info in session
        req.session.user = { username: user.username, email: user.email };
        console.log(req.session.user);
        res.json({ message: "Login successful", user: { username: user.username, email: user.email } });
      } else {
        // invalid password
        console.log("Invalid password");
        res.status(401).json({ error: "Invalid Password" });
      }
    } else {
      // user not found
      console.log("User not found");
      res.status(401).json({ error: "User not found" });
    }
});

// Start the server
app.listen(port, () => {
//   db = await lib.connect(url);
  console.log(`Server listening at http://localhost:${port}`);
});