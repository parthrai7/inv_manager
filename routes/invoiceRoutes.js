const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const PDFDocument = require("pdfkit");

// Generate Invoice PDF
router.get("/invoice/:saleId", async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.saleId).populate("items.stockId");
        if (!sale) return res.status(404).json({ error: "Sale not found" });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice_${sale._id}.pdf`);
        doc.pipe(res);

        // Invoice Header
        doc.fontSize(18).text("Sales Invoice", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Buyer: ${sale.buyer}`);
        doc.text(`Date: ${sale.date ? sale.date.toDateString() : new Date(sale.createdAt).toDateString()}`);
        doc.moveDown();

        // Table Header
        doc.fontSize(12).text("Item", 50, doc.y, { width: 200, underline: true });
        doc.text("Qty", 300, doc.y, { width: 50, underline: true });
        doc.text("Price", 400, doc.y, { width: 50, underline: true });
        doc.text("Total", 500, doc.y, { width: 50, underline: true });
        doc.moveDown();

        let totalAmount = 0;

        // List Sale Items
        sale.items.forEach(item => {
            const itemName = item.stockId?.item || "Unknown Item";
            const itemTotal = item.quantity * item.price;
            totalAmount += itemTotal;

            doc.text(itemName, 50, doc.y, { width: 200 });
            doc.text(item.quantity.toString(), 300, doc.y, { width: 50 });
            doc.text(`$${item.price}`, 400, doc.y, { width: 50 });
            doc.text(`$${itemTotal}`, 500, doc.y, { width: 50 });
            doc.moveDown();
        });

        // Total Amount
        doc.moveDown();
        doc.fontSize(14).text(`Grand Total: $${totalAmount}`, { align: "right", bold: true });

        doc.end();
    } catch (error) {
        console.error("Invoice error:", error);
        res.status(500).json({ msg: "Server error", error });
    }
});

module.exports = router;
