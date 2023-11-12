const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter an password"],
    minlength: [6, "minimum password length is 6 character "],
  },
});

//fire a function after a user saved to the database
userSchema.post("save", (doc, next) => {
  console.log("new user was created and saved", doc);
  next();
});

//fire a function before a user saved to the database "mongoose hooks"
userSchema.pre("save", async function (next) {
  console.log("user about to be created & saved", this);
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method for login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
const User = mongoose.model("user", userSchema);

module.exports = User;
