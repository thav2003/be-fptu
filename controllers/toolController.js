const confessionServices = require("../service/confessionServices");
module.exports = {
  Cancel: confessionServices.deletePost,
};
