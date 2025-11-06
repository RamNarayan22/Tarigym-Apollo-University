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
          myScore: existingScore ? existingScore.marks : null
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
    const { posterId, marks, comments } = req.body;

    if (!posterId || marks === undefined) {
      return res.status(400).json({ message: 'Please provide posterId and marks' });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: 'Marks must be between 0 and 100' });
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
      score.marks = marks;
      score.comments = comments || '';
      score.submittedAt = Date.now();
      await score.save();
    } else {
      score = await Score.create({
        poster: posterId,
        judge: req.user._id,
        marks,
        comments: comments || ''
      });
    }

    res.json({ message: 'Score submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
