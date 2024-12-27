const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const accessToken = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        expiresIn: 3600, // 1 hour
      });

      const refreshToken = generateRefreshToken();
      user.refreshToken = refreshToken; // Save in DB, update user model to include this field
      await user.save();

      const authorities = [];
      const roles = await user.getRoles();
      roles.forEach((role) => {
        authorities.push("ROLE_" + role.name.toUpperCase());
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshtoken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).send({ message: "Refresh Token is required!" });
  }

  const user = await User.findOne({
    where: { refreshToken },
  });

  if (!user) {
    return res.status(403).send({ message: "Refresh token is invalid!" });
  }

  const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
    algorithm: "HS256",
    expiresIn: 3600, // 1 hour
  });

  res.status(200).send({
    accessToken: newAccessToken,
  });
};
