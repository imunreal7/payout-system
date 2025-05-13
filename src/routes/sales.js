// src/routes/sales.js
const express = require("express");
const Sales = require("../models/Sales");
const router = express.Router();

router.post("/", async (req, res) => {
    const sale = await Sales.create(req.body);
    res.status(201).json(sale);
});

module.exports = router;

