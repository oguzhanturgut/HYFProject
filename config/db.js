const mongoose = require('mongoose');

const connectDB = async connection => {
  try {
    await mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
