const service = require('../controllers/reimbursement_service_master_ctrl');
const router = require('express').Router()
const middileware = require('../middileware/index')
const reimbursementMiddileware = require('../middileware/reimbursement')
const express = require('express');

router.post('/add',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,service.add)
router.get('/get',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,service.get)
router.delete('/delete',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,service.delete)
router.put('/edit',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,service.edit)
//router.post('/addFile',service.addFile)
module.exports = router;