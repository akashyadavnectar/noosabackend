const reimbursementMiddileware = {};
const Constant = require("../config/constant");
var db = require("../models");
const reimbursement = db.reimbursement_doctor_master;

reimbursementMiddileware.checkDoctorAuthentication = (req, res, next) => {
  try {
    console.log("req.user", req.user);
    let { userId, role } = req.user;
    let { id } = req.body;
    if (role == 1 || role == 2) {
      next();
    } else {
      return res.status(Constant.INVALID_CODE).json({
        code: Constant.INVALID_CODE,
        message: Constant.USER_NOT_AUTHORIZED,
        data: null,
      });
    }
  } catch (error) {
    return res.status(Constant.SERVER_ERROR).json({
      code: Constant.SERVER_ERROR,
      message: Constant.SOMETHING_WENT_WRONG,
      data: error.message,
    });
  }
};
module.exports = reimbursementMiddileware;
