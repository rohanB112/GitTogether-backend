const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateProfileUpdateData = (req) => {
  const allowedUpdateFields = [
    "firstName",
    "lastName",
    "about",
    "photoUrl",
    "age",
    "skills",
    "gender",
  ];

  isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedUpdateFields.includes(field)
  );

  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateProfileUpdateData };
