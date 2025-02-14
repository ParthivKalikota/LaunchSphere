import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  buyProduct,
} from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Seller routes (requires seller authentication)
router.post("/", protectRoute, createProduct);
router.get("/seller", protectRoute, getSellerProducts);
router.put("/:id", protectRoute, updateProduct);
router.delete("/:id", protectRoute, deleteProduct);

// Customer routes
router.get("/", getProducts); // All products
router.get("/:id", getProductById); // Single product
router.post("/:id/buy", protectRoute, buyProduct); // Buy product

export default router;
