const fs = require("fs");
const jwt = require("jsonwebtoken");

const TEAM_ID = "35PJ8SQUWK";
const CLIENT_ID = "com.mrbids.web";
const KEY_ID = "2A8HRMUWXX";

const privateKey = fs.readFileSync("./AuthKey_2A8HRMUWXX.p8");

const token = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d",
  audience: "https://appleid.apple.com",
  issuer: TEAM_ID,
  subject: CLIENT_ID,
  keyid: KEY_ID,
});

console.log("\nAPPLE SECRET:\n");
console.log(token);