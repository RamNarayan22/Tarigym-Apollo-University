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
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
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
