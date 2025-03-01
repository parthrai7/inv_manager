require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import and use routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const stockRoutes = require("./routes/stockRoutes");
app.use("/api", stockRoutes);

const salesRoutes = require("./routes/salesRoutes"); // ✅ Sales routes
app.use("/sales", salesRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes"); // ✅ Invoice routes
app.use("/invoice", invoiceRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ msg: "Internal Server Error", error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
