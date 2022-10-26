const mongoose = require("mongoose");

const sequenceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    seq: {
      type: Number,
      default: 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Sequence = mongoose.model("Sequences", sequenceSchema);
module.exports = Sequence;
