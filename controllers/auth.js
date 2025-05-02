import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.redirect("/login");

    // res.status(201).json({ message: "User created successfully", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          process.env.SECRET_KEY,
          { expiresIn: "365d" }
        );
         
        res.cookie("token", token, {httpOnly: true});

        return res.redirect('/products');
        // res
        //   .status(200)
        //   .json({ success: true, message: "Logged in successfully", token });
      } else {
        res
          .status(403)
          .json({ success: false, message: "Invalid credentials" });
      }
    } else {
      res.status(403).json({ success: false, message: "Invalid credentials" });
    }
    // res.redirect('/products');
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export const getLogin = (req, res) => {
  res.render("login");
};
