const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 },
});

const expenseSchema = new Schema({
    date: { type: Date, required: true },
    items: [itemSchema],
    total: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Expense", expenseSchema);