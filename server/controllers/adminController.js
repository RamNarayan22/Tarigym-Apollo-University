const User = require('../models/User');
const Poster = require('../models/Poster');
const Score = require('../models/Score');

exports.createJudge = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const judge = await User.create({
      username,
      password,
      role: 'judge'
    });

    res.status(201).json({
      message: 'Judge created successfully',
      judge: {
        id: judge._id,
        username: judge.username,
        role: judge.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllJudges = async (req, res) => {
  try {
    const judges = await User.find({ role: 'judge' }).select('-password');
    res.json(judges);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.uploadPoster = async (req, res) => {
  try {
    const { title, authors, description, posterId } = req.body;

    let authorsList = [];
    if (typeof authors === 'string') {
      authorsList = JSON.parse(authors);
    } else if (Array.isArray(authors)) {
      authorsList = authors;
    }

    if (!title || !authorsList.length || !description || !posterId || !req.file) {
      return res.status(400).json({ message: 'Please provide poster ID, title, authors, description, and image' });
    }

    const existingPoster = await Poster.findOne({ posterId });
    if (existingPoster) {
      return res.status(400).json({ message: 'Poster ID already exists' });
    }

    const poster = await Poster.create({
      posterId,
      title,
      authors: authorsList,
      description,
      imageUrl: `/uploads/${req.file.filename}`
    });

    res.status(201).json({
      message: 'Poster uploaded successfully',
      poster
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllPosters = async (req, res) => {
  try {
    const posters = await Poster.find().populate('assignedJudges', 'username');
    res.json(posters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.assignPosterToJudge = async (req, res) => {
  try {
    const { posterId, judgeId } = req.body;

    const poster = await Poster.findById(posterId);
    if (!poster) {
      return res.status(404).json({ message: 'Poster not found' });
    }

    const judge = await User.findById(judgeId);
    if (!judge || judge.role !== 'judge') {
      return res.status(404).json({ message: 'Judge not found' });
    }

    if (!poster.assignedJudges.includes(judgeId)) {
      poster.assignedJudges.push(judgeId);
      await poster.save();
    }

    res.json({ message: 'Poster assigned successfully', poster });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllScores = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('poster', 'title')
      .populate('judge', 'username');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPosterScores = async (req, res) => {
  try {
    const { posterId } = req.params;
    
    const scores = await Score.find({ poster: posterId })
      .populate('judge', 'username');
    
    const totalMarks = scores.reduce((sum, score) => sum + score.marksForOverall, 0);
    const averageMarks = scores.length > 0 ? totalMarks / scores.length : 0;
    
    const avgTitle = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForTitle, 0) / scores.length : 0;
    const avgObjectives = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForObjectives, 0) / scores.length : 0;
    const avgMethodology = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForMethodology, 0) / scores.length : 0;
    const avgResults = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForResults, 0) / scores.length : 0;
    const avgPresentationQA = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForPresentationQA, 0) / scores.length : 0;

    res.json({
      scores,
      summary: {
        totalScores: scores.length,
        averageMarks: averageMarks.toFixed(2),
        totalMarks,
        avgTitle: avgTitle.toFixed(2),
        avgObjectives: avgObjectives.toFixed(2),
        avgMethodology: avgMethodology.toFixed(2),
        avgResults: avgResults.toFixed(2),
        avgPresentationQA: avgPresentationQA.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
