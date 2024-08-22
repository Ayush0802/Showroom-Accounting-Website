const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    billno : { type: Number, required: true },
    name : { type: String, required: true },
    date: { type: Date, required: true },
    cashpayment: { type: Number, required: true },
    bankpayment: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);