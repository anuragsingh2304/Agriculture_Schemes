import cookie from "cookie"
import jwt from "jsonwebtoken"
const { verify } = jwt
import User from "../models/Users.js"

const protect = async (req, res, next) => {
  let token;

  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Access denied: Admins only" })
  }
}

export { protect, isAdmin }