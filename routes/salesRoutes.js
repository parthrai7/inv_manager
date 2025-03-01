const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const invoiceRoutes = require('./invoiceRoutes');

router.post('/sell', async (req, res) => {
    try {
        const { buyer, items } = req.body;

        // Check stock availability
        for (let item of items) {
            const stock = await Stock.findById(item.stockId);
            if (!stock || stock.quantity < item.quantity) {
                return res.status(400).json({ msg: 'Stock not available' });
            }
            stock.quantity -= item.quantity;
            await stock.save();
        }

        // Create sale record
        const newSale = new Sale({ buyer, items });
        await newSale.save();

        // Generate and send PDF invoice
        generateInvoice(newSale, res);

    } catch (error) {
        console.error('Sale error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
