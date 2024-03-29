'use strict'
const validation = require('../helpers/validation')
const utility = require('../helpers/utility')
var db = require("../models");
const Constant = require('../config/constant');
const users = db.users;
const policy = db.policies;
const serviceRequests = db.service_request;
const userPolicy = db.user_policies;
const serviceRequest = {};

serviceRequest.getAllServiceRequest = async (req, res) => {
    try {
        let { search, policy_id, user_id, agent_id, verifyStatus } = req.query;
        let condition = {
            status: true
        }

        if (policy_id) {
            condition['$userPolicy.policy_id$'] = policy_id;
        }

        if (user_id) {
            condition['$userPolicy.user_id$'] = user_id;
        }

        if (agent_id) {
            condition['$userPolicy.agent_id$'] = agent_id;
        }

        if (verifyStatus) {
            condition['verifyStatus'] = verifyStatus;
        }

        if (search) {
            condition['$or'] = {
                "$userPolicy.policy.policyName": {
                    $like: `%${search}%`
                },
                "$userPolicy.policy.policyCode": {
                    $like: `%${search}%`
                },
                "$userPolicy.user.firstName": {
                    $like: `%${search}%`
                },
                "complaintCode": {
                    $like: `%${search}%`
                },
                "verifyStatus": {
                    $like: `%${search}%`
                },
            }
        }

        serviceRequests.findAll({
            where: condition,
            include: [{
                model: userPolicy,
                as: 'userPolicy',
                where: {
                    status: true
                },
                include: [{
                    model: users,
                    as: "agent",
                    attributes: ["firstName", "lastName", "userName", "email", "phone"],
                    where: {
                        status: true
                    }
                }, {
                    model: users,
                    as: "user",
                    attributes: ["firstName", "lastName", "userName", "email", "phone"],
                    where: {
                        status: true
                    }
                }, {
                    model: policy,
                    as: "policy",
                    where: {
                        status: true
                    }
                }]
            }]
        }).then(result => {
            result = JSON.parse(JSON.stringify(result));
            let message = (result.length > 0) ? Constant.RETRIEVE_SUCCESS : Constant.NO_DATA_FOUND
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: message,
                data: result
            })
        }).catch(error => {
            console.log("error 1", error)

            return res.status(Constant.SERVER_ERROR).json({
                code: Constant.SERVER_ERROR,
                message: Constant.SOMETHING_WENT_WRONG,
                data: error
            })
        })
    } catch (error) {
        console.log("error ", error)
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error
        })
    }

}

serviceRequest.add = async (req, res) => {
    try {
        let serviceRequestData = await validation.serviceRequest(req.body);

        if (serviceRequestData.message) {
            return res.status(Constant.ERROR_CODE).json({
                code: Constant.ERROR_CODE,
                message: Constant.INVAILID_DATA,
                data: serviceRequestData.message
            })
        } else {
            serviceRequestData.serviceCode = await utility.generateCode('REQ_', 'serviceId', 10);
            serviceRequestData.date = new Date();
            let result = await serviceRequests.create(serviceRequestData);

            if (result) {
                return res.status(Constant.SUCCESS_CODE).json({
                    code: Constant.SUCCESS_CODE,
                    message: Constant.SAVE_SUCCESS,
                    data: result
                })
            } else {
                return res.status(Constant.ERROR_CODE).json({
                    code: Constant.ERROR_CODE,
                    message: Constant.SOMETHING_WENT_WRONG,
                    data: {}
                })
            }
        }

    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error
        })
    }
}

serviceRequest.edit = async (req, res) => {
    try {
        let { id, name, priorityStatus, description, assignedTo, assignedBy } = req.body;
        if (id) {
            serviceRequests.findOne({
                where: {
                    id: id,
                    status: true
                }
            }).then(async (result) => {
                if (result) {
                    let serviceRequestData = {
                        name: name,
                        priorityStatus: priorityStatus,
                        description: description,
                        assignedTo: assignedTo,
                        assignedBy: assignedBy
                    }

                    await result.update(serviceRequestData);
                    return res.status(Constant.SUCCESS_CODE).json({
                        code: Constant.SUCCESS_CODE,
                        message: Constant.UPDATED_SUCCESS,
                        data: result
                    })
                } else {
                    return res.status(Constant.ERROR_CODE).json({
                        code: Constant.ERROR_CODE,
                        message: Constant.SOMETHING_WENT_WRONG,
                        data: result
                    })
                }

            }).catch(error => {
                return res.status(Constant.SERVER_ERROR).json({
                    code: Constant.SERVER_ERROR,
                    message: Constant.SOMETHING_WENT_WRONG,
                    data: error.message
                })
            })
        } else {
            return res.status(Constant.ERROR_CODE).json({
                code: Constant.ERROR_CODE,
                message: "id is required.",
                data: {}
            })
        }

    } catch (error) {
        console.log("error ", error)
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error.message
        })
    }
}

serviceRequest.delete = async (req, res) => {
    try {
        let { id } = req.body;

        serviceRequests.findOne({
            where: {
                id: id,
                status: true
            }
        }).then(async (result) => {
            if (result) {
                let serviceRequestData = {
                    status: 0
                }
                await result.update(serviceRequestData);

                return res.status(Constant.SUCCESS_CODE).json({
                    code: Constant.SUCCESS_CODE,
                    message: Constant.DELETED_SUCCESS,
                    data: result
                })

            } else {
                return res.status(Constant.ERROR_CODE).json({
                    code: Constant.ERROR_CODE,
                    message: Constant.SOMETHING_WENT_WRONG,
                    data: result
                })
            }

        }).catch(error => {
            return res.status(Constant.SERVER_ERROR).json({
                code: Constant.SERVER_ERROR,
                message: Constant.SOMETHING_WENT_WRONG,
                data: error
            })
        })

    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error
        })
    }
}

serviceRequest.verifyRequest = async (req, res) => {
    try {
        let { verifyStatus, VerifiedDate, id } = req.body;
        serviceRequests.findOne({
            where: {
                id: id,
                status: true
            }
        }).then(async (result) => {
            if (result) {
                let serviceRequestData = {
                    VerifiedDate: VerifiedDate,
                    verifyStatus: verifyStatus
                }
                await result.update(serviceRequestData);
                return res.status(Constant.SUCCESS_CODE).json({
                    code: Constant.SUCCESS_CODE,
                    message: Constant.VERIFIED_SUCCESS,
                    data: result
                })
            } else {
                return res.status(Constant.ERROR_CODE).json({
                    code: Constant.ERROR_CODE,
                    message: Constant.SOMETHING_WENT_WRONG,
                    data: result
                })
            }
        }).catch(error => {
            return res.status(Constant.SERVER_ERROR).json({
                code: Constant.SERVER_ERROR,
                message: Constant.SOMETHING_WENT_WRONG,
                data: error
            })
        })
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error
        })
    }
}

module.exports = serviceRequest;