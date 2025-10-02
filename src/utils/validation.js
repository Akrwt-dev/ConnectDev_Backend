const validator = require("validator");

const ValidatSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (firstName.lengh == 0 || lastName.length == 0) {
    throw new Error("Please Enter the Name");
  } else if (firstName.lengh < 2 || firstName.length > 50) {
    throw new Error("Invlaid Name");
  } else if (lastName.lengh < 2 || lastName.length > 50) {
    throw new Error("Invlaid Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invlaid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = { ValidatSignUpData };
