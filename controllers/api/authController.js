const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const {
  handleErrors,
} = require("../../middleware/errorHandlers/authErrorHandler");

module.exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({
      email: email,
      password: password,
    });
    const token = User.createToken(user._id);

    res.status(201).json({
      message: "user created successfully",
      token: token,
      user: { id: user._id, email: user, email },
    });
  } catch (err) {
    res.status(400).json(handleErrors(err));
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = User.createToken(user._id);
    res.cookie("token", token);
    res.status(200).json({
      message: "logged in successfully",
      user: { id: user._id, email: user, email },
    });
  } catch {
    res.status(400).json(handleErrors(err));
  }
};
