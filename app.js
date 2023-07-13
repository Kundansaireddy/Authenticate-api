const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 3006;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const dbURI =
  "mongodb+srv://KSR:160120748032@cluster0.8hmqm9g.mongodb.net/Clicked";

const loginSchema = new mongoose.Schema({
  name: String,
  password: String,
});
const User = mongoose.model("User", loginSchema);
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
app.get("/", (req, res) => {
  res.send("Port 3006");
});
app.post("/api/newuser", (req, res) => {
  const { name, password } = req.body;
  const newUser = new User({ name, password });
  newUser
    .save()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error saving new user to the database:", error);
      res.sendStatus(500);
    });
});
app.post("/api/checkUser", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ name: email, password })
    .then((user) => {
      if (user) {
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    })
    .catch((error) => {
      console.error("Error checking data in the database:", error);
      res.sendStatus(500);
    });
});
app.post("/api/ifAlready", (req, res) => {
  const { name } = req.body;

  User.findOne({ name })
    .then((user) => {
      if (user) {
        res.sendStatus(409);
      } else {
        res.sendStatus(200);
      }
    })
    .catch((error) => {
      console.error("Error checking data in the database:", error);
      res.sendStatus(500);
    });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
