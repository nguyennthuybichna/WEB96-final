const express = require('express');
const router = express.Router();
const teacherPositionController = require('../controllers/teacherPositionController');

router.get('/', teacherPositionController.getTeacherPositions);
router.post('/', teacherPositionController.createTeacherPosition);

module.exports = router;
