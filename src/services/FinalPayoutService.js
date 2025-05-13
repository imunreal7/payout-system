const Final = require("../models/FinalPayouts");
const Txns = require("../models/PayoutTransactions");
const Users = require("../models/Users");
const Partner = require("./PayoutPartnerClient");

async function processFinals() {
    const finals = await Final.findUnpaid();
    for (let f of finals) {
        const txn = await Txns.create({
            user_id: f.user_id,
            amount_cents: f.amount_cents,
            type: "final",
            status: "pending",
        });
        const res = await Partner.pay(f.user_id, f.amount_cents);
        await Txns.updateStatus(txn.txn_id, res.success ? "success" : "failed", res.externalRef);
        if (res.success) {
            await Final.markPaid(f.payout_id, txn.txn_id);
            await Users.incrementBalance(f.user_id, f.amount_cents);
        } else {
            // Q2: credit back on failure
            await Users.incrementBalance(f.user_id, f.amount_cents);
        }
    }
}
module.exports = { processFinals };
