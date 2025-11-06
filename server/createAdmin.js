const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('✅ Admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
