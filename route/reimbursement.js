const ReimbursementController = require('../controllers/reimbursement_ctrl');
const express = require('express');
const middileware = require('../middileware/index')
const reimbursementMiddileware = require('../middileware/reimbursement')
const router = require('express').Router()

router.post('/add',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,ReimbursementController.add)
router.get('/getData',ReimbursementController.getData)

router.put('/:id',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,ReimbursementController.updateReimbursement)
router.delete('/:id',middileware.checkAuthentication,reimbursementMiddileware.checkDoctorAuthentication,ReimbursementController.deleteReimbursement)

module.exports = router;