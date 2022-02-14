const db = require('../models');
const reimbursement_doctor_master = db.reimbursement_doctor_master;

//adding information
const add = async (req,res) => {
    let { doctorName, specialization, description } = req.body;
    let reimbursementData = {
        doctorName : doctorName,
        specialization : specialization,
        description : description
    }

    const add = await reimbursement_doctor_master.create(reimbursementData)
    res.status(200).send(add)
    console.log(add)

}

// getting all information

const getData = async (req,res) => {
    let reimbursement = await reimbursement_doctor_master.findAll({})
    res.status(200).send(reimbursement)
    console.log(holiday)
}

// updating information
const updateReimbursement = async (req,res) => {
    let  {id} = req.body
    let reimbursement = await reimbursement_doctor_master.update(req.body,{where : {id:id}})
    res.status(200).send(reimbursement)
}

// deleting information
const deleteReimbursement = async (req,res) => {
    let {id } = req.body
    await reimbursement_doctor_master.destroy({where : {id:id}})
    res.status(200).send('Data deleted')
}

module.exports = {
    add,
    getData,
    updateReimbursement,
    deleteReimbursement

}