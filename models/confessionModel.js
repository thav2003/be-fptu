const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 10,
      required: [true, "Too short!"],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Not find your ID."],
    },
    approver: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    status: {
      // 0 pending, 1 accept, 2 reject
      type: Number,
      default: 0,
    },
    cfsID: {
      type: String,
      default: null,
    },
    tags: [
      {
        id: {
          type: String,
          required: [true, "Please provide a tag id"],
        },
        name: {
          type: String,
        },
      },
    ],
    reaction: {
      like: {
        type: Number,
        default: 0,
      },
      love: {
        type: Number,
        default: 0,
      },
      haha: {
        type: Number,
        default: 0,
      },
      sory: {
        type: Number,
        default: 0,
      },
      wow: {
        type: Number,
        default: 0,
      },
      anger: {
        type: Number,
        default: 0,
      },
      sad: {
        type: Number,
        default: 0,
      },
    },
    comments: [
      {
        created_time: {
          type: Date,
        },
        message: {
          type: String,
        },
        id: {
          type: String,
          required: [true, "Please provide a comment id"],
        },
      },
    ],
    reaction_total: {
      type: Number,
      default: 0,
    },
    view: {
      type: Number,
      default: 0,
    },
    share: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: null,
    },
    timeApprove: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
confessionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "name",
  });
  this.populate({
    path: "approver",
    select: "name",
  });
  next();
});
const Confession = mongoose.model("Confessions", confessionSchema);

module.exports = Confession;
