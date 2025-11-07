const Poster = require('../models/Poster');
const Score = require('../models/Score');

exports.getAssignedPosters = async (req, res) => {
  try {
    const posters = await Poster.find({ assignedJudges: req.user._id });
    
    const postersWithScores = await Promise.all(
      posters.map(async (poster) => {
        const existingScore = await Score.findOne({
          poster: poster._id,
          judge: req.user._id
        });
        
        return {
          ...poster.toObject(),
          scored: !!existingScore,
          myScore: existingScore ? existingScore.marksForOverall : null,
          myScoreBreakdown: existingScore ? {
            marksForCreativity: existingScore.marksForCreativity,
            marksForPresentation: existingScore.marksForPresentation,
            marksForInnovation: existingScore.marksForInnovation,
            marksForRelevance: existingScore.marksForRelevance
          } : null
        };
      })
    );

    res.json(postersWithScores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitScore = async (req, res) => {
  try {
    const { posterId, marksForCreativity, marksForPresentation, marksForInnovation, marksForRelevance, comments } = req.body;

    if (!posterId || marksForCreativity === undefined || marksForPresentation === undefined || marksForInnovation === undefined || marksForRelevance === undefined) {
      return res.status(400).json({ message: 'Please provide posterId and all marks' });
    }

    if (marksForCreativity < 0 || marksForCreativity > 25 || marksForPresentation < 0 || marksForPresentation > 25 || marksForInnovation < 0 || marksForInnovation > 25 || marksForRelevance < 0 || marksForRelevance > 25) {
      return res.status(400).json({ message: 'All marks must be between 0 and 25' });
    }

    const poster = await Poster.findById(posterId);
    if (!poster) {
      return res.status(404).json({ message: 'Poster not found' });
    }

    if (!poster.assignedJudges.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not assigned to this poster' });
    }

    let score = await Score.findOne({ poster: posterId, judge: req.user._id });

    if (score) {
      score.marksForCreativity = marksForCreativity;
      score.marksForPresentation = marksForPresentation;
      score.marksForInnovation = marksForInnovation;
      score.marksForRelevance = marksForRelevance;
      score.marksForOverall = marksForCreativity + marksForPresentation + marksForInnovation + marksForRelevance;
      score.comments = comments || '';
      score.submittedAt = Date.now();
      await score.save();
    } else {
      score = await Score.create({
        poster: posterId,
        judge: req.user._id,
        marksForCreativity: marksForCreativity,
        marksForPresentation: marksForPresentation,
        marksForInnovation: marksForInnovation,
        marksForRelevance: marksForRelevance,
        marksForOverall: marksForCreativity + marksForPresentation + marksForInnovation + marksForRelevance,
        comments: comments || ''
      });
    }

    res.json({ message: 'Score submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
