const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const pageable = async (Model, req) => {
  const self = {
    currentPage: 0,
    totalPage: 0,
    limit: 1000,
  };

  const paramRequest = req.query;

  if (paramRequest.limit != undefined)
    self.limit = parseInt(paramRequest.limit);

  //total page
  const count = await Model.countDocuments({});
  self.totalPage = Math.ceil(count / self.limit);

  if (paramRequest.page != undefined)
    self.currentPage = parseInt(paramRequest.page);
  if (self.currentPage > self.totalPage - 1)
    self.currentPage = self.totalPage - 1;
  if (self.currentPage < 0) self.currentPage = 0;

  return self;
};
const responseList = catchAsync(async (data, page, res) =>
  res.status(200).json({
    status: "success",
    data: data,
    totalPage: page.totalPage,
    limit: page.limit,
    results: data.length,
    page: page.currentPage,
    sort: "createAt",
  })
);
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    //console.log(req.body);
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    const page = await pageable(Model, req);

    const features = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
exports.pageable = pageable;
exports.responseList = responseList;
