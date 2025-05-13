const knex = require("../db/knex");
module.exports = {
    create: ({ user_id }) => knex("users").insert({ user_id }).returning("*"),
    findById: (userId) => knex("users").where("user_id", userId).first(),
    incrementBalance: (userId, amountCents) =>
        knex("users")
            .where("user_id", userId)
            .increment("balance_cents", amountCents)
            .returning("*"),
};
