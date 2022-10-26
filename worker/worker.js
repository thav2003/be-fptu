const { GraphServices } = require("../service/facebookServices");
const Confession = require("../models/confessionModel");
const factory = require("../controllers/handlerFactory");
const worker = async () => {
  try {
    console.log("loading ....");
    const data = await GraphServices.getData();
    // console.log("Done ....");
    console.log(data);
    for (const confession of data) {
      await Confession.updateOne(
        {
          cfsID: confession.id,
          status: 1,
        },
        {
          $set: {
            reaction: confession.reactions,
            view: confession.view,
            share: confession.share,
            title: confession.title,
            reaction_total: confession.reaction_total,
            comments: confession.comments,
            tags: confession.tags,
          },
        }
      );
    }
    console.log("Fetched RSS at: ", new Date().toISOString());
  } catch (err) {
    console.error("Error: ", err.toString());
    console.error("Fetch RSS failed at: ", new Date().toISOString());
  }
};

module.exports = worker;
