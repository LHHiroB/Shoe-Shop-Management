const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const token = request.header("auth-token");
  if (!token) return response.status(401).send("Access Denied");

  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    return response.status(400).send("Invalid Token");
  }
};
