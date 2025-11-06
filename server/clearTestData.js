const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Poster = require('./models/Poster');
const Score = require('./models/Score');

const clearTestData = async () => {
  try {
    await connectDB();
    
    await Poster.deleteMany({});
    console.log('✅ All posters deleted');
    
    await Score.deleteMany({});
    console.log('✅ All scores deleted');
    
    await User.deleteMany({ role: 'judge' });
    console.log('✅ All judges deleted');
    
    console.log('\n✅ Test data cleared! Admin account preserved.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearTestData();
