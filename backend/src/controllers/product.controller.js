import Product from "../models/product.model.js";

// Create new product (Seller only)
export const createProduct = async (req, res) => {
  try {
    // Check if user is a seller
    if (!req.user.isSeller) {
      return res
        .status(403)
        .json({ message: "Only sellers can create products" });
    }

    const { name, description, price, quantity, image } = req.body;

    // Validate required fields
    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price and quantity
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const product = new Product({
      name,
      description,
      price,
      quantity,
      image: image || "",
      seller: req.user._id,
    });

    const savedProduct = await product.save();
    console.log("Product created:", savedProduct); // Debug log

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Get all products (for customers)
export const getProducts = async (req, res) => {
  try {
    // Remove any quantity filter to get all products
    const products = await Product.find()
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get seller's products
export const getSellerProducts = async (req, res) => {
  try {
    if (!req.user.isSeller) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove any quantity filter to get all seller's products
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getSellerProducts:", error);
    res.status(500).json({ message: "Error fetching seller products" });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "fullName email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Update product (Seller only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own products" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete product (Seller only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

// Buy product (Customer only)
export const buyProduct = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Update product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(200).json({
      message: "Purchase successful",
      product,
    });
  } catch (error) {
    console.error("Error in buyProduct:", error);
    res.status(500).json({ message: "Error processing purchase" });
  }
};
