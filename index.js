const express = require("express");
const jsforce = require("jsforce");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = 3000;

app.use(cors());

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD } = process.env;

const conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl: SF_LOGIN_URL,
});

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

app.listen(PORT, () => {
  console.log("Server running!!");
});
