const holidayController = require('../controllers/holiday_ctrl')

const router = require('express').Router()

router.post('/addHoliday',holidayController.addHoliday)
router.get('/getHoliday',holidayController.getHoliday)

router.put('/:id',holidayController.updateHoliday)
router.delete('/:id',holidayController.deleteHoliday)

module.exports = router;