const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catalogSchema = new Schema({
    name: { type: String, required: true },
    products: [{ name: String, mrp: Number, dp:Number }],
    discount:{type:Number}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Catalog", catalogSchema);