module.exports = {
  dto: function (model) {
    const self = {
      id: model._id,
      fbID: model.cfsID,
      title: model.title,
      content: model.content,
      sender: model.sender._id,
      approver: model.approver._id,
      href: `https://www.facebook.com/${model.cfsID}`,
    };
    return self;
  },
};
