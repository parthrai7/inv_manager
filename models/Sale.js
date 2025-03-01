const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({  // ✅ Fix: Changed 'saleSchema' name correctly
  items: [
    {
      stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  buyer: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model("Sale", saleSchema); // ✅ Fix: Consistently using 'saleSchema'
module.exports = Sale;
