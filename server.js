const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const worker = require("./worker/worker");
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}...`);
});
//worker();
// worker().then(() => {
//   //every minutes => can chuyen sang every hour
//   cron.schedule(
//     "59 * * * * *",
//     async () => {
//       await worker();
//     },
//     null
//   );
// });

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
