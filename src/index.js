require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const salesRt = require("./routes/sales");
const recRt = require("./routes/reconcile");
const payoutRt = require("./routes/payouts");
const userRt = require("./routes/users");
const { processAdvances } = require("./services/AdvancePayoutService");
const { processFinals } = require("./services/FinalPayoutService");

const app = express();
app.use(express.json());
app.use("/sales", salesRt);
app.use("/reconcile", recRt);
app.use("/payouts", payoutRt);
app.use("/users", userRt);

// Scheduled jobs
cron.schedule("0 * * * *", processAdvances);
cron.schedule("30 * * * *", processFinals);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
