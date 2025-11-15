const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poster',
    required: true
  },
  judge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  marksForTitle: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  marksForObjectives: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  marksForMethodology: {
    type: Number,
    required: true,
    min: 0,
    max: 8
  },
  marksForResults: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  marksForPresentationQA: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  marksForOverall: {
    type: Number,
    required: true,
    min: 0,
    max: 25
  },
  comments: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

scoreSchema.index({ poster: 1, judge: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
