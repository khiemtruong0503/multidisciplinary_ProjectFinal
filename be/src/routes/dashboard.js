const express = require('express');
const router = express.Router();
const dashboardController = require('../app/controllers/dashboardController');

router.get('/', dashboardController.dashboard);
router.post('/', dashboardController.updateLed);
// router.post('/getUsers', dashboardController.updateLed);

module.exports = router;