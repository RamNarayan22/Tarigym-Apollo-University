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
    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      return res.status(400).json({ message: 'Please provide title, description, and image' });
    }

    const poster = await Poster.create({
      title,
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
    
    const avgCreativity = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForCreatvity, 0) / scores.length : 0;
    const avgPresentation = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForPresentation, 0) / scores.length : 0;
    const avgInnovation = scores.length > 0 ? scores.reduce((sum, s) => sum + s.marksForInnovation, 0) / scores.length : 0;

    res.json({
      scores,
      summary: {
        totalScores: scores.length,
        averageMarks: averageMarks.toFixed(2),
        totalMarks,
        avgCreativity: avgCreativity.toFixed(2),
        avgPresentation: avgPresentation.toFixed(2),
        avgInnovation: avgInnovation.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
