const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model
const { generateToken } = require("../jwt"); // Import generateToken

// User Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, business, email, mobile, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists!" });
    }


    // Create a new user
    const newUser = new User({ name, business, email, mobile, password });
    await newUser.save();
    console.log("User saved successfully!");

    // Generate JWT Token
    const token = generateToken(newUser._id);

    // Send success response
    res.status(201).json({
      msg: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});
router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email or Password is missing" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Debugging: Check if user._id is defined
      console.log("User ID:", user._id);
  
      if (!user._id) {
        return res.status(500).json({ error: "User ID is undefined" });
      }
  
      // ✅ Pass full user object (not just user._id)
      const token = generateToken({ _id: user._id, email: user.email });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


module.exports = router;
