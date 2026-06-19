const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    // check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;