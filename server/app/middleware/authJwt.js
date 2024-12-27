const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    req.userScopes = decoded.scopes;
    next();
  });
};

checkScope = (requiredScope) => {
  return (req, res, next) => {
    if (!req.userScopes || !req.userScopes.includes(requiredScope)) {
      return res.status(403).send({
        message: "Require " + requiredScope,
      });
    }
    next();
  };
};

checkScope = (requiredScope) => {
  return (req, res, next) => {
    if (!req.userScopes || !req.userScopes.includes(requiredScope)) {
      return res.status(403).send({
        message: "Require " + requiredScope,
      });
    }
    next();
  };
};

const authJwt = {
  verifyToken: verifyToken,
  checkScope: checkScope,
};

module.exports = authJwt;
