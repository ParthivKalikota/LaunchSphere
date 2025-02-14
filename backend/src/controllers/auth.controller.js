import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, isSeller } = req.body;
    console.log("Signup request:", { fullName, email, isSeller });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      isSeller: isSeller || false,
    });

    await user.save();
    console.log("User created successfully");

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password doesn't match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    const userResponse = {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isSeller: user.isSeller,
      },
    };

    console.log("Login successful, sending response:", userResponse);
    res.json(userResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("Logout request received");
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

export const check = async (req, res) => {
  try {
    console.log("Auth check request received");

    // User should be attached by auth middleware
    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userResponse = {
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        isSeller: req.user.isSeller,
      },
    };

    console.log("Auth check successful, sending response:", userResponse);
    res.json(userResponse);
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Error checking auth status" });
  }
};
