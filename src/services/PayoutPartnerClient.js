module.exports = {
    async pay(userId, amountCents) {
        // TODO: integrate real payout API
        // Simulate random failure
        const success = Math.random() > 0.1;
        return { success, externalRef: "EXT-" + Date.now() };
    },
};
