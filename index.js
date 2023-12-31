const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware's
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x32av.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("languageSafari").collection("users");

    const instructorCollection = client.db("languageSafari").collection("instructors");

    const classCollection = client.db("languageSafari").collection("classes");

     // Users Related API's
     app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post('/users', async(req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'User already exists' })
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Instructors Related API's
    app.get("/instructors", async(req, res) => {
      const result = await instructorCollection.find().toArray();
      res.send(result);
    });

    // Get popular instructors(limit(6))
    app.get("/popular-instructors", async(req, res) => {
      const result = await instructorCollection.find().limit(6).toArray();
      res.send(result);
    });

    // Classes Related API's
    app.get("/classes", async(req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Language Safari Server is Running");
});

app.listen(port, () => {
    console.log(`Language Safari Server is Running on Port : ${port}`);
});
