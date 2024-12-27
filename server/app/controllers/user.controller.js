exports.allAccess = (req, res) => {
  res.status(200).send("Test info lab4.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Test User lab4.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Test Admin lab4.");
};

exports.readPerm = (req, res) => {
  res.status(200).send("Reading is allowed");
};

exports.writePerm = (req, res) => {
  res.status(200).send("Writing is allowed");
};
