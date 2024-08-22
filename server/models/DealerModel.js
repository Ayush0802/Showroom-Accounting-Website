const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dealerSchema = new Schema({
    month : { type: String, required: true },
    company : { type: String, required: true },
    date: { type: Date, required: true },
    cashpayment: { type: Number, required: true },
    bankpayment: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Dealer", dealerSchema);