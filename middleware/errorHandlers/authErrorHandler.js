module.exports.handleErrors = (err) => {
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
