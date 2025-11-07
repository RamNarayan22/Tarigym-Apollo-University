const express = require('express');
const router = express.Router();
const {
  createJudge,
  getAllJudges,
  uploadPoster,
  getAllPosters,
  assignPosterToJudge,
  getAllScores,
  getPosterScores
} = require('../controllers/adminController');
const { exportScores } = require('../controllers/exportController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.use(adminOnly);

router.post('/judges', createJudge);
router.get('/judges', getAllJudges);

router.post('/posters', upload.single('image'), uploadPoster);
router.get('/posters', getAllPosters);
router.post('/assign', assignPosterToJudge);

router.get('/scores', getAllScores);
router.get('/scores/:posterId', getPosterScores);
router.get('/export', exportScores);

module.exports = router;
