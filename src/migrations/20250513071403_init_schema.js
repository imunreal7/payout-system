exports.up = async function (knex) {
    await knex.schema
        .createTable("users", (tbl) => {
            tbl.string("user_id").primary();
            tbl.bigInteger("balance_cents").notNullable().defaultTo(0);
            tbl.timestamps(true, true);
        })
        .createTable("sales", (tbl) => {
            tbl.uuid("sale_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            tbl.string("user_id").notNullable().references("user_id").inTable("users");
            tbl.string("brand").notNullable();
            tbl.enu("status", ["pending", "approved", "declined"]).notNullable();
            tbl.bigInteger("earning_cents").notNullable();
            tbl.timestamp("reconciled_at").nullable();
            tbl.timestamps(true, true);
        })
        .createTable("payout_transactions", (tbl) => {
            tbl.uuid("txn_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            tbl.string("user_id").notNullable().references("user_id").inTable("users");
            tbl.bigInteger("amount_cents").notNullable();
            tbl.enu("type", ["advance", "final"]).notNullable();
            tbl.enu("status", ["pending", "success", "failed", "cancelled"]).notNullable();
            tbl.timestamp("requested_at").defaultTo(knex.fn.now());
            tbl.timestamp("completed_at").nullable();
            tbl.string("external_ref").nullable();
        })
        .createTable("advance_payouts", (tbl) => {
            tbl.uuid("payout_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            tbl.uuid("sale_id").notNullable().unique().references("sale_id").inTable("sales");
            tbl.string("user_id").notNullable().references("user_id").inTable("users");
            tbl.bigInteger("amount_cents").notNullable();
            tbl.timestamp("paid_at").defaultTo(knex.fn.now());
            tbl.uuid("payout_txn_id").references("txn_id").inTable("payout_transactions");
        })
        .createTable("final_payouts", (tbl) => {
            tbl.uuid("payout_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            tbl.uuid("sale_id").notNullable().unique().references("sale_id").inTable("sales");
            tbl.string("user_id").notNullable().references("user_id").inTable("users");
            tbl.bigInteger("amount_cents").notNullable();
            tbl.timestamp("paid_at").nullable();
            tbl.uuid("payout_txn_id")
                .nullable()
                .references("txn_id")
                .inTable("payout_transactions");
        });
};

exports.down = async function (knex) {
    await knex.schema
        .dropTableIfExists("final_payouts")
        .dropTableIfExists("advance_payouts")
        .dropTableIfExists("payout_transactions")
        .dropTableIfExists("sales")
        .dropTableIfExists("users");
};

