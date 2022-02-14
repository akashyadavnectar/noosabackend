const utility = require("../helpers/utility");
var db = require("../models");
const Constant = require("../config/constant");
const reimbursement_service_master = db.reimbursement_service_master;
const service = {};

service.add = async (req, res) => {
  try {
    let ImageData = [];
    if (req.files) {
      ImageData = await utility.imageupload(req.files);
      // console.log("imagedata", ImageData);

      const add = await reimbursement_service_master.create(ImageData[0]);
      res.status(200).send(add);
    } else {
      return res.status(Constant.SERVER_ERROR).json({
        code: Constant.SERVER_ERROR,
        message: "Minimum one file is required",
        data: "",
      });
    }
  } catch (error) {
    return res.status(Constant.SERVER_ERROR).json({
      code: Constant.SERVER_ERROR,
      message: Constant.SOMETHING_WENT_WRONG,
      data: error,
    });
  }
};

service.get = async (req, res) => {
  try {
    let reimbursementService = await reimbursement_service_master.findAll({});
    res.status(200).send(reimbursementService);
  } catch (error) {
    return res.status(Constant.SERVER_ERROR).json({
      code: Constant.SERVER_ERROR,
      message: Constant.SOMETHING_WENT_WRONG,
      data: error,
    });
  }
};

service.delete = async (req, res) => {
  try {
    let { id } = req.body;
      await reimbursement_service_master.destroy({ where: { id: id } });
      res.status(200).send("Data deleted");
    }
   catch (error) {
    return res.status(Constant.SERVER_ERROR).json({
      code: Constant.SERVER_ERROR,
      message: Constant.SOMETHING_WENT_WRONG,
      data: error,
    });
  }
};

service.edit = async (req, res) => {
  try {
    let { id } = req.body;
    
    let reimbursement = await reimbursement_service_master.update(req.body, {
      where: { id: id },
    });
    
    res.status(200).send(reimbursement);
  } catch (error) {
    return res.status(Constant.SERVER_ERROR).json({
      code: Constant.SERVER_ERROR,
      message: Constant.SOMETHING_WENT_WRONG,
      data: error,
    });
  }
};
module.exports = service;
