const knexFin = require("../db/knex");
module.exports = {
    create: ({ sale_id, user_id, amount_cents }) =>
        knexFin("final_payouts").insert({ sale_id, user_id, amount_cents }).returning("*"),
    findUnpaid: () =>
        knexFin("final_payouts as f")
            .leftJoin("payout_transactions as t", "f.payout_txn_id", "t.txn_id")
            .whereNull("f.paid_at")
            .select("f.*"),
    markPaid: (payoutId, txnId) =>
        knexFin("final_payouts")
            .where("payout_id", payoutId)
            .update({ paid_at: knex.fn.now(), payout_txn_id: txnId }),
};
