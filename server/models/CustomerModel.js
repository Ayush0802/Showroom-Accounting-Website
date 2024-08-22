const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    company: { type: String, required: true },
    name: { type: String, required: true },
    catalog: { type: String, required: true },
    code: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
});

const customerSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: Date, required: true },
    billno: { type: Number, required: true },
    products: [productSchema],
    amountToBePaid: { type: Number, required: true, min: 0 },
    amountPaidCash: { type: Number, required: true, min: 0 },
    amountPaidBank: { type: Number, required: true, min: 0 },
    finalamount: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0 },
    transport: { type: Number, required: true, min: 0 },
    amountLeftToBePaid: { type: Number, required: true, min: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", customerSchema);