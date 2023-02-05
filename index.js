const express = require("express");
const jsforce = require("jsforce");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./auth");
require("dotenv").config();
const PORT = 3000;

// MIDDLEWARES
app.use(bodyParser.json());
app.use(cors());

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD } = process.env;

const conn = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL,
});

// LOGIN INTO SALESFORCE
app.get("/login", (req, res) => {
  conn.login(SF_USERNAME, SF_PASSWORD, (err, userInfo) => {
    if (err) {
      return console.error(err);
    }

    console.log(conn);
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    res.send({ userInfo, instanceUrl: conn.instanceUrl });
  });
});

//GET SESSION FROM SALESFORCE
app.post("/getSession", (req, res) => {
  const file = req.body;
  res.send({ recibido: true });
  console.log("***Usuario formulario reactivo: ", file);
});

// GOOGLE AUTH
app.get("/auth/google", (req, res) => {
  console.log("*** Inside /auth/google");
  passport.authenticate("google", { scope: ["email", "profile"] });
});

// GOOGLE AUTH CALLBACK GOES HERE
app.get("/auth/callback", (req, res) => {
  passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/failure",
  });
});

app.get("/home", (req, res) => {
  res.send("Home");
});

app.get("/failure", (req, res) => {
  res.send("Failure");
});

app.listen(PORT, () => {
  console.log("Server running!!");
});
