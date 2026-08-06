const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/smartcart")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Order schema
const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// Save new order
app.post("/save-order", async (req, res) => {
  try {
    const newOrder = new Order({
      items: req.body.items,
      total: req.body.total
    });
    await newOrder.save();
    console.log("New order saved!", req.body);
    res.status(200).json({ message: "Order saved successfully" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get past orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));