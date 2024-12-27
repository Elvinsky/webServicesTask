const jwt = require("jsonwebtoken");
const config = require("../app/config/auth.config.js");
const db = require("../app/models/index");
const authJwt = require("../app/middleware/authJwt.js"); // Assuming the original code is in authJwt.js

// Mocking dependencies
jest.mock("jsonwebtoken");
jest.mock("../app/config/auth.config.js");
jest.mock("../app/models/index");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("verifyToken", () => {
    it("should return 403 if no token is provided", () => {
      authJwt.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ message: "No token provided!" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", () => {
      req.headers["x-access-token"] = "invalid-token";
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      authJwt.verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: "Unauthorized!" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if token is valid", () => {
      req.headers["x-access-token"] = "valid-token";
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: "user-id" });
      });

      authJwt.verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(req.userId).toBe("user-id");
      expect(next).toHaveBeenCalled();
    });
  });
});
