const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    email: "",
    password: "",
  };

  //validation errors
  if (err.name == "ValidationError") {
    errors.email = err.errors.email != null ? err.errors.email.message : "";
    errors.password =
      err.errors.password != null ? err.errors.password.message : "";
  }
  //duplicate error
  if (err.code === 11000) {
    errors.email = "This email is already used";
  }
  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = err.message;
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = err.message;
  }
  return {
    // message: err.message,
    errors: errors,
  };
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({
      email: email,
      password: password,
    });
    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      message: "user created successfully",
      user: { id: user._id, email: user, email },
    });
  } catch (err) {
    res.status(400).json(handleErrors(err));
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("token", token);
    res.status(200).json({
      message: "logged in successfully",
      user: { id: user._id, email: user, email },
    });
  } catch (err) {
    res.status(400).json(handleErrors(err));
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
