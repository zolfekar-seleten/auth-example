const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/front/authRoutes");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

//config the env variables
require("dotenv").config();

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(process.env.PORT ?? 3000))
  .catch((err) => console.log(err));

// routes
app.get("*", authMiddleware.checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", authMiddleware.requireAuth, (req, res) => {
  res.render("smoothies");
});
app.use(routes);

//cookies
app.get("/set-cookie", (req, res) => {
  // res.setHeader("set-cookie", "newUser=false");

  res.cookie("newUser", false);
  //this cookie valid for 1 day

  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true, //it couldn't be modified by front end user
  });

  res.send("you got the cookies");
});

app.get("/get-cookie", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});
