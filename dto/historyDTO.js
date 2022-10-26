module.exports = {
  dto: function (model) {
    const self = {
      id: model._id,
      approver: model.approver.name,
      content: model.content,
      updatedAt: model.updatedAt,
      cfsID: model.cfsID,
      title: model.title || "",
      tags: [model.status === 1 ? "Duyệt" : "Loại"],
    };
    return self;
  },
};
