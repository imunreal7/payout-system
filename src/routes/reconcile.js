const express = require("express");
const { reconcile } = require("../services/ReconciliationService");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        await reconcile(req.body);
        res.json({ message: "Reconciliation completed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;

