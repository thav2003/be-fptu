const confessionServices = require("../service/confessionServices");
module.exports = {
  getAllConfessions: confessionServices.getAllConfessions,
  createNewConfession: confessionServices.createNewConfession,
  acceptConfession: confessionServices.acceptConfession,
  rejectConfession: confessionServices.rejectConfession,
  getApprovedConfessions: confessionServices.getApprovedConfessions,
  getMyConfessions: confessionServices.getMyConfessions,
  getPending: confessionServices.getPending,
  getHisoryConfessions: confessionServices.getHisoryConfessions,
  Analyze: confessionServices.Analyze,
  Cancel: confessionServices.deletePost,
};
