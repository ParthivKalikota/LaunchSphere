
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    // req.user is set by protectRoute middleware
    const user = req.user;

    res.json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      isSeller: user.isSeller,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Update user fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    user.phone = phone; // Allow phone to be updated or cleared

    await user.save();

    // Return updated user data
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      isSeller: user.isSeller,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
