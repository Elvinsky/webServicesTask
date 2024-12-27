const verifyScope = (requiredScopes) => (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    const tokenScopes = decoded.scope || [];
    const hasScope = requiredScopes.every((scope) =>
      tokenScopes.includes(scope)
    );

    if (!hasScope) {
      return res.status(403).send({ message: "Insufficient permissions!" });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyScope;
