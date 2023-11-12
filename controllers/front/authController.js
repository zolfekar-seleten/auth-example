const User = require("../../models/User");

const {
  handleErrors,
} = require("../../middleware/errorHandlers/authErrorHandler");

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
    const token = User.createToken(user._id);
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
    const token = User.createToken(user._id);
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
