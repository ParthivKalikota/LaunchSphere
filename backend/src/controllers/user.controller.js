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
