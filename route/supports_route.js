const Supports = require('../controllers/supports_ctrl');
const router = require('express').Router()

router.post('/add',Supports.add);
router.put('/edit',Supports.edit);
router.delete('/delete',Supports.delete);
router.get('/get',Supports.get);

module.exports = router;