const Sales = require("../models/Sales");
const Adv = require("../models/AdvancePayouts");
const Final = require("../models/FinalPayouts");

async function reconcile(list) {
    for (let { saleId, status } of list) {
        await Sales.updateStatus(saleId, status);
        const [sale, advance] = await Promise.all([Sales.findById(saleId), Adv.findBySale(saleId)]);
        const advAmt = advance ? advance.amount_cents : 0;
        const rem = status === "approved" ? sale.earning_cents - advAmt : -advAmt;
        await Final.create({ sale_id: saleId, user_id: sale.user_id, amount_cents: rem });
    }
}
module.exports = { reconcile };
