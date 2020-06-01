//jshint esversion:6
require ('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({
  extended: true
}));

//set up views folder for ejs files
app.set("view engine", "ejs");

//set up 'public' folder for storing public files such as CSS, images, videos etc.
app.use(express.static("public"));

//verify app.js server is active and listening
app.listen(3000, function() {
  console.log("server listening on port 3000");
});

//set up mongoDB database
mongoose.connect("mongodb://localhost:27017/userBD", {
  useNewUrlParser: true
});

//verify mongoDB connection
mongoose.connection
  .once("open", () => console.log("database connected"));

// //set up mongoDB schema - this works for regular DB,
// it does not work for db with ecryption option,
// hence new schema that allows encryption is defined below
// const userSchema = {
//   email: String,
//   password: String
// };

//set up mongoose-encryption enabled schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//encrption key moved to .env file
//enebale use of encyption by using plugin that allows encyrption option
// this must be done before creating a model
userSchema.plugin(encrypt, { secret: process.env.secret, encryptedFields: ["password"] });

//set up mongoDB model for user records
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(er);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });

});
