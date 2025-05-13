const express = require("express");
const Sales = require("../models/Sales");
const Users = require("../models/Users");
const router = express.Router();

// Create user for testing
router.post("/user", async (req, res) => {
    const user = await Users.create({ user_id: req.body.user_id });
    res.status(201).json(user);
});

// Create a sale
router.post("/", async (req, res) => {
    try {
        const sale = await Sales.create(req.body);
        res.status(201).json(sale[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List pending sales
router.get("/", async (req, res) => {
    const list = await Sales.findPendingWithoutAdvance();
    res.json(list);
});

router.get("/:id/balance", async (req, res) => {
    const user = await Users.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ balance_cents: user.balance_cents });
});
module.exports = router;
