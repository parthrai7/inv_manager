const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantity: { type: Number, required: true },  // Changed to Number
    supplier: { type: String, required: true },
    cp: { type: Number, required: true },        // Changed to Number
    sp: { type: Number, required: true },        // Added sp field
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Tracks who added stock
});

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
