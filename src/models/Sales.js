const knex = require("../db/knex");
module.exports = {
    create: (sale) => knex("sales").insert(sale).returning("*"),
    findById: (saleId) => knex("sales").where("sale_id", saleId).first(),
    findPendingWithoutAdvance: () =>
        knex("sales as s")
            .leftJoin("advance_payouts as a", "s.sale_id", "a.sale_id")
            .where("s.status", "pending")
            .andWhereNull("a.sale_id")
            .select("s.*"),
    updateStatus: (saleId, status) =>
        knex("sales").where("sale_id", saleId).update({ status, reconciled_at: knex.fn.now() }),
};
