const factory = require("../controllers/handlerFactory");
const Confession = require("../models/confessionModel");
const Sequence = require("../models/counterModel");
const approveDTO = require("../dto/approveDTO");
const historyDTO = require("../dto/historyDTO");
const catchAsync = require("../utils/catchAsync");
const { GraphServices } = require("./facebookServices");
const AppError = require("../utils/appError");
async function updateNextSequence(Model, sequenceOfName, req, len) {
  const page = await factory.pageable(Model, req);
  const doc = await Model.findById(sequenceOfName)
    .sort({ createAt: -1 })
    .skip(page.currentPage * page.limit)
    .limit(page.limit);
  await Model.updateOne(
    { _id: sequenceOfName },
    {
      $inc: {
        seq: len,
      },
    }
  );
}
module.exports = {
  getAllConfessions: factory.getAll(Confession),
  createNewConfession: catchAsync(async (req, res, next) => {
    const currentLoggedUser = req.user;
    const payload = {
      sender: currentLoggedUser._id,
      content: req.body.content,
    };
    const doc = await Confession.create(payload);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  }),
  acceptConfession: catchAsync(async (req, res, next) => {
    try {
      const { confessID, newContent, titles } = req.body;
      const page = await factory.pageable(Confession, req);
      const doc = await Confession.find({ _id: { $in: confessID }, status: 0 })
        .sort({ createAt: -1 })
        .skip(page.currentPage * page.limit)
        .limit(page.limit);
      const confess = doc[0];
      if (!confess) {
        res.status(400).json({
          success: false,
          message: "No confess finded",
        });
      }
      const data = {
        message: newContent,
      };
      // const resFB = await GraphServices.createPost(data);
      // if (!resFB || !resFB.id) {
      //   res
      //     .status(200)
      //     .json({ success: false, error: "Not find id post in FB" });
      // }
      const currentLoggedUser = req.user;
      await updateNextSequence(
        Sequence,
        "acceptConfession",
        req,
        confessID.length
      );
      //console.log(doc);
      for (let i = 0; i < doc.length; i++) {
        await Confession.updateOne(
          {
            _id: doc[i]._id,
            status: 0,
          },
          {
            $set: {
              status: 1,
              approver: currentLoggedUser._id,
              //cfsID: resFB.id,
              title: titles[i],
            },
            $currentDate: {
              timeApprove: true,
            },
          }
        );
      }

      res.status(200).json({ success: true });
    } catch (error) {
      return next(new AppError("Loi API", 401));
      //res.status(500).json({ success: false, error: error });
    }
  }),
  rejectConfession: catchAsync(async (req, res, next) => {
    try {
      const { confessID, reason } = req.body;
      const page = await factory.pageable(Confession, req);
      const doc = await Confession.find({ _id: confessID, status: 0 })
        .sort({ createAt: -1 })
        .skip(page.currentPage * page.limit)
        .limit(page.limit);
      const confess = doc[0];
      if (!confess) {
        res.status(400).json({
          success: false,
          message: "No confess exists for this id",
        });
      }
      const currentLoggedUser = req.user;
      const result = await Confession.updateOne(
        {
          _id: confessID,
          status: 0,
        },
        {
          $set: {
            status: 2,
            approver: currentLoggedUser._id,
            reason: reason || null,
          },
          $currentDate: {
            timeApprove: true,
          },
        }
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(new AppError("Loi API", 401));
      //res.status(500).json({ success: false, error: error });
    }
  }),
  getApprovedConfessions: catchAsync(async (req, res, next) => {
    const page = await factory.pageable(Confession, req);
    const doc = await Confession.find({ status: 1 })
      .sort({ timeApprove: -1 })
      .skip(page.currentPage * page.limit)
      .limit(page.limit);
    const response = [];
    for (let i = 0; i < doc.length; i++) {
      // eslint-disable-next-line no-continue
      if (doc[i] === null) continue;
      const confessionI = approveDTO.dto(doc[i]);
      for (let j = i + 1; j < doc.length; j++) {
        const confessionJ = approveDTO.dto(doc[j]);
        if (confessionI.fbID === confessionJ.fbID) {
          doc[j] = null;
          confessionI.content += "\n\n";
          confessionI.content += confessionJ.content;
        } else {
          i = j - 1;
          break;
        }
      }
      response.push(confessionI);
    }
    factory.responseList(response, page, res);
  }),
  getMyConfessions: catchAsync(async (req, res, next) => {
    try {
      const currentLoggedUser = req.user;
      const page = await factory.pageable(Confession, req);
      const doc = await Confession.find({ sender: currentLoggedUser._id })
        .sort({ createAt: -1 })
        .skip(page.currentPage * page.limit)
        .limit(page.limit);
      // const response = [];
      // for (let i = 0; i < doc.length; i++) {
      //   response.push(doc[i]); // chua DTO,cần thì data transfer object
      // }
      factory.responseList(doc, page, res);
    } catch (error) {
      return next(new AppError("Loi API", 401));
      //res.status(500).json({ success: false, error: error });
    }
  }),
  getPending: catchAsync(async (req, res, next) => {
    try {
      const page = await factory.pageable(Confession, req);
      const doc = await Confession.find({ status: 0 })
        .sort({ createAt: -1 })
        .skip(page.currentPage * page.limit)
        .limit(page.limit);
      const sequencePage = await factory.pageable(Sequence, req);
      const sequenceDoc = await Sequence.findById("acceptConfession")
        .sort({ createAt: -1 })
        .skip(sequencePage.currentPage * sequencePage.limit)
        .limit(sequencePage.limit);
      if (!sequenceDoc) {
        const newSeq = await Sequence.create({ _id: "acceptConfession" });
        res.status(200).json({
          status: "success",
          data: doc,
          stt: newSeq.seq,
          totalPage: page.totalPage,
          limit: page.limit,
          results: doc.length,
          page: page.currentPage,
          sort: "createAt",
        });
      }
      //factory.responseList(doc, page, res);
      res.status(200).json({
        status: "success",
        data: doc,
        stt: sequenceDoc.seq,
        totalPage: page.totalPage,
        limit: page.limit,
        results: doc.length,
        page: page.currentPage,
        sort: "createAt",
      });
    } catch (error) {
      return next(new AppError("Loi API", 401));
      //res.status(500).json({ success: false, error: error });
    }
  }),
  getHisoryConfessions: catchAsync(async (req, res, next) => {
    try {
      const page = await factory.pageable(Confession, req);
      const doc = await Confession.find({ $or: [{ status: 1 }, { status: 2 }] })
        .sort({ timeApprove: -1 })
        .skip(page.currentPage * page.limit)
        .limit(page.limit);
      const response = [];
      const filterAdmin = [
        ...new Map(
          doc.map(obj => [obj.approver.name, obj.approver.name])
        ).values(),
      ];
      for (let i = 0; i < doc.length; i++) {
        // eslint-disable-next-line no-continue
        if (doc[i] === null) continue;
        const confessionI = historyDTO.dto(doc[i]);
        for (let j = i + 1; j < doc.length; j++) {
          const confessionJ = historyDTO.dto(doc[j]);
          if (confessionI.cfsID === confessionJ.cfsID) {
            doc[j] = null;
            confessionI.content += "\n\n";
            confessionI.content += confessionJ.content;
          } else {
            i = j - 1;
            break;
          }
        }
        response.push(confessionI);
      }
      //console.log(response);
      res.status(200).json({
        status: "success",
        data: response,
        filterAdmin: filterAdmin,
        totalPage: page.totalPage,
        limit: page.limit,
        results: doc.length,
        page: page.currentPage,
        sort: "updatedAt",
      });
    } catch (error) {
      return next(new AppError("Loi API", 401));
      //res.status(500).json({ success: false, error: error });
    }
  }),
  Analyze: catchAsync(async (req, res, next) => {
    // const ip =
    //   (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    //   req.socket.remoteAddress;
    // console.log(ip);
    //console.log(req.ip);
    const page = await factory.pageable(Confession, req);
    const doc = await Confession.find({ status: 1 })
      .sort({ timeApprove: -1 })
      .skip(page.currentPage * page.limit)
      .limit(page.limit);
    // const response = [];
    // for (let i = 0; i < doc.length; i++) {
    //   response.push(doc[i]); // chua DTO,cần thì data transfer object
    // }
    factory.responseList(doc, page, res);
  }),
  deletePost: catchAsync(async (req, res, next) => {
    try {
      const { fbID } = req.params;
      const currentLoggedUser = req.user;
      await GraphServices.deletePost(fbID);
      const result = await Confession.updateMany(
        {
          cfsID: fbID,
          status: 1,
        },
        {
          $set: {
            status: 2,
            approver: currentLoggedUser._id,
          },
          $currentDate: {
            timeApprove: true,
          },
        }
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(new AppError("Loi API facebook", 401));
      //res.status(500).json({ success: false, error: "Loi API facebook" });
    }
  }),
};
