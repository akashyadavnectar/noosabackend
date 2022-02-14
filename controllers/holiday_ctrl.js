const db = require('../models');
const holidays = db.holidays

//add holiday

const addHoliday = async (req,res) => {
    let { name, date, day, type } = req.body;
    let holidayData = {
        name : name,
        date : date,
        day : day,
        type : type
    }

    const holiday = await holidays.create(holidayData);
    res.status(200).send(holiday)
    console.log(holiday)

}

//get holiday
const getHoliday = async (req,res) => {
    let holiday = await holidays.findAll({})
    res.status(200).send(holiday)
    console.log(holiday)
}

//update holiday
const updateHoliday = async (req,res) => {
    let  {id} = req.body
    let holiday = await holidays.update(req.body,{where : {id:id}})
    res.status(200).send(holiday)
}

//delete holiday
const deleteHoliday = async (req,res) => {
    let {id } = req.body
    await holidays.destroy({where : {id:id}})
    res.status(200).send('holiday deleted')
}

module.exports = {
    addHoliday,
    getHoliday,
    updateHoliday,
    deleteHoliday
}
