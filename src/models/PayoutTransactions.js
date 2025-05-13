const knex = require("../db/knex");
module.exports = {
    create: ({ user_id, amount_cents, type, status }) =>
        knex("payout_transactions")
            .insert({ user_id, amount_cents, type, status })
            .returning("*")
            .then((rows) => rows[0]),
    updateStatus: (txnId, newStatus, externalRef) =>
        knex("payout_transactions")
            .where("txn_id", txnId)
            .update({ status: newStatus, external_ref: externalRef, completed_at: knex.fn.now() }),
};
