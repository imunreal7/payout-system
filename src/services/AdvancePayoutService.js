const Sales = require("../models/Sales");
const Txns = require("../models/PayoutTransactions");
const Adv = require("../models/AdvancePayouts");
const Users = require("../models/Users");
const Partner = require("./PayoutPartnerClient");

async function processAdvances() {
    const sales = await Sales.findPendingWithoutAdvance();
    for (let s of sales) {
        const advanceAmt = Math.floor(s.earning_cents * 0.1);
        const txn = await Txns.create({
            user_id: s.user_id,
            amount_cents: advanceAmt,
            type: "advance",
            status: "pending",
        });
        const res = await Partner.pay(s.user_id, advanceAmt);
        await Txns.updateStatus(txn.txn_id, res.success ? "success" : "failed", res.externalRef);
        if (res.success) {
            await Adv.create({
                sale_id: s.sale_id,
                user_id: s.user_id,
                amount_cents: advanceAmt,
                payout_txn_id: txn.txn_id,
            });
            await Users.incrementBalance(s.user_id, advanceAmt);
        }
    }
}
module.exports = { processAdvances };
