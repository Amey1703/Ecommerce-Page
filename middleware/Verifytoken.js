import jwt from "jsonwebtoken";
import User from "../models/User.js";


// export const verifyToken = (req, res, next) => {
//   let token;
//   let authHeader = req.headers.Authorization || req.headers.authorization;
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ message: "Invalid token" });
//       }
//       req.user = decoded;
//       next();
//     });
//   }else{
//     return res.status(401).json({ message: "Token not provided" });
//   }
// };


export const Authenticate = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
      res.clearCookie('token');
      return res.redirect('/login');
  }
}