import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getSellerOrders,
  getSellerSales,
  getSellerStats,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/customer", protectRoute, getCustomerOrders);
router.get("/seller", protectRoute, getSellerOrders);
router.get("/seller-sales", protectRoute, getSellerSales);
router.get("/seller-stats", protectRoute, getSellerStats);

export default router;
