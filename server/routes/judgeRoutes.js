const express = require('express');
const router = express.Router();
const { getAssignedPosters, submitScore } = require('../controllers/judgeController');
const { protect, judgeOnly } = require('../middleware/auth');

router.use(protect);
router.use(judgeOnly);

router.get('/posters', getAssignedPosters);
router.post('/score', submitScore);

module.exports = router;
