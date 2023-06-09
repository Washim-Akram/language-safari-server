const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware's
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Language Safari Server is Running");
});

app.listen(port, () => {
    console.log(`Language Safari Server is Running on Port : ${port}`);
});
