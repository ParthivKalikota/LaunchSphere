import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const customer = req.user._id;

    if (!products || !products.length) {
      return res.status(400).json({ message: "No products in order" });
    }

    // Group products by seller
    const sellerProducts = {};
    const orderProducts = [];
    let totalAmount = 0;

    // First, verify all products and quantities
    for (const item of products) {
      const product = await Product.findById(item._id).populate("seller");

      if (!product) {
        return res.status(404).json({
          message: `Product not found`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.quantity} units available for ${product.name}`,
        });
      }

      // Group by seller for sales tracking
      if (!sellerProducts[product.seller._id]) {
        sellerProducts[product.seller._id] = {
          amount: 0,
          products: [],
        };
      }

      const itemTotal = product.price * item.quantity;
      sellerProducts[product.seller._id].amount += itemTotal;
      sellerProducts[product.seller._id].products.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        seller: product.seller._id,
      });

      totalAmount += itemTotal;

      // Update product quantity
      await Product.findByIdAndUpdate(product._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    // Create the order
    const order = await Order.create({
      customer,
      products: orderProducts,
      totalAmount,
    });

    // Update each seller's sales data
    for (const [sellerId, data] of Object.entries(sellerProducts)) {
      await User.findByIdAndUpdate(sellerId, {
        $inc: {
          totalSales: data.amount,
          totalOrders: 1,
        },
      });
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    const totalSpent = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    res.json({ orders, totalSpent });
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("products.product")
      .populate("customer", "fullName email")
      .sort({ createdAt: -1 });

    const totalEarnings = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    res.json({ orders, totalEarnings });
  } catch (error) {
    console.error("Get seller orders error:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Add this function to get seller's sales data
export const getSellerSales = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id);
    const orders = await Order.find({
      "products.seller": req.user._id,
    }).populate("customer", "fullName email");

    res.json({
      totalSales: seller.totalSales || 0,
      totalOrders: seller.totalOrders || 0,
      orders,
    });
  } catch (error) {
    console.error("Get seller sales error:", error);
    res.status(500).json({ message: "Error fetching sales data" });
  }
};

export const getSellerStats = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $unwind: "$products" },
      { $match: { "products.seller": req.user._id } },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
    ]);

    const activeOrders = await Order.countDocuments({
      "products.seller": req.user._id,
      status: { $ne: "completed" },
    });

    res.json({
      totalSales: totalSales[0]?.total || 0,
      activeOrders,
    });
  } catch (error) {
    console.error("Get seller stats error:", error);
    res.status(500).json({ message: "Error fetching seller statistics" });
  }
};
