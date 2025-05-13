const knexAdv = require("../db/knex");
module.exports = {
    create: ({ sale_id, user_id, amount_cents, payout_txn_id }) =>
        knexAdv("advance_payouts")
            .insert({ sale_id, user_id, amount_cents, payout_txn_id })
            .returning("*"),
    findBySale: (saleId) => knexAdv("advance_payouts").where("sale_id", saleId).first(),
};
