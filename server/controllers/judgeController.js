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
            marksForTitle: existingScore.marksForTitle,
            marksForObjectives: existingScore.marksForObjectives,
            marksForMethodology: existingScore.marksForMethodology,
            marksForResults: existingScore.marksForResults,
            marksForPresentationQA: existingScore.marksForPresentationQA
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
    const { posterId, marksForTitle, marksForObjectives, marksForMethodology, marksForResults, marksForPresentationQA, comments } = req.body;

    if (!posterId || marksForTitle === undefined || marksForObjectives === undefined || marksForMethodology === undefined || marksForResults === undefined || marksForPresentationQA === undefined) {
      return res.status(400).json({ message: 'Please provide posterId and all marks' });
    }

    if (marksForTitle < 0 || marksForTitle > 3 || marksForObjectives < 0 || marksForObjectives > 3 || marksForMethodology < 0 || marksForMethodology > 8 || marksForResults < 0 || marksForResults > 6 || marksForPresentationQA < 0 || marksForPresentationQA > 5) {
      return res.status(400).json({ message: 'Invalid marks range' });
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
      score.marksForTitle = marksForTitle;
      score.marksForObjectives = marksForObjectives;
      score.marksForMethodology = marksForMethodology;
      score.marksForResults = marksForResults;
      score.marksForPresentationQA = marksForPresentationQA;
      score.marksForOverall = marksForTitle + marksForObjectives + marksForMethodology + marksForResults + marksForPresentationQA;
      score.comments = comments || '';
      score.submittedAt = Date.now();
      await score.save();
    } else {
      score = await Score.create({
        authorName: poster.authorName,
        poster: posterId,
        judge: req.user._id,
        marksForTitle,
        marksForObjectives,
        marksForMethodology,
        marksForResults,
        marksForPresentationQA,
        marksForOverall: marksForTitle + marksForObjectives + marksForMethodology + marksForResults + marksForPresentationQA,
        comments: comments || ''
      });
    }

    res.json({ message: 'Score submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
