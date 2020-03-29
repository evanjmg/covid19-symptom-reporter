const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

const getBodyFromTokenHeader = headers => {

  try {
    const body = jwt.verify(
      headers.authorization &&
        headers.authorization.slice().replace("Bearer ", ""),
      secret
    );
    return body
  } catch (err) {
    return false;
  }
};

const signUser = user => {
  return jwt.sign(user, secret, { expiresIn: 1440212141244 });
};
module.exports = {
  getBodyFromTokenHeader,
  signUser
};
