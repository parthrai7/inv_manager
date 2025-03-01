const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock"); // ✅ Import Stock model
const { jwtAuthMiddleware } = require("../jwt"); // ✅ Import JWT middleware
const mongoose = require("mongoose");

// ✅ Add stock (Protected Route)
router.put("/update_stock/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const { quantity } = req.body;
      const stockId = req.params.id;
  
      // ✅ Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(stockId)) {
        return res.status(400).json({ error: "Invalid stock ID format" });
      }
  
      // ✅ Find existing stock
      const existingStock = await Stock.findById(stockId);
      if (!existingStock) {
        return res.status(404).json({ error: "Stock item not found" });
      }
  
      // ✅ Increase quantity instead of replacing it
      existingStock.quantity += quantity;
  
      await existingStock.save();
  
      res.status(200).json({ msg: "Stock quantity updated successfully!", stock: existingStock });
    } catch (error) {
      console.error("Stock update error:", error);
      res.status(500).json({ msg: "Server error", error });
    }
  });
// ✅ View all stock (Protected Route)
router.get("/view_stock", jwtAuthMiddleware, async (req, res) => {
  try {
    const stocks = await Stock.find().populate("addedBy", "name email");
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Stock fetch error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});


router.put("/update_stock/:id", jwtAuthMiddleware, async (req, res) => {
    try {
        const { item, quantity, supplier, cp, sp } = req.body;
        const stockId = req.params.id;

        // ✅ Check if stockId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(stockId)) {
            return res.status(400).json({ error: "Invalid stock ID format" });
        }

        // Find and update stock
        const updatedStock = await Stock.findByIdAndUpdate(
            stockId,
            { item, quantity, supplier, cp, sp },
            { new: true } // Returns updated document
        );

        if (!updatedStock) {
            return res.status(404).json({ error: "Stock item not found" });
        }

        res.status(200).json({ msg: "Stock updated successfully!", stock: updatedStock });
    } catch (error) {
        console.error("Stock update error:", error);
        res.status(500).json({ msg: "Server error", error });
    }
});
module.exports = router;