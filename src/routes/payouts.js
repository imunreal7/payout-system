const express = require("express");
const { processAdvances } = require("../services/AdvancePayoutService");
const { processFinals } = require("../services/FinalPayoutService");
const router = express.Router();
router.post("/advance/run", async (req, res) => {
    try {
        await processAdvances();
        res.json({ message: "Advance run" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/final/run", async (req, res) => {
    try {
        await processFinals();
        res.json({ message: "Final run" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = router;
