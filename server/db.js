const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      return;
    }

    // console.log('---------', process.env.MONGODB_USER, process.env.MONGODB_PWD);

    await mongoose.connect(`mongodb://localhost:27017`, {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PWD,
      authSource: 'admin',
      dbName: process.env.MONGODB_NAME,
    });
    return Promise.resolve();
  } catch (error) {
    console.log('[db error]: 链接数据失败');
    console.log(error);
  }
};

module.exports = connectDB;
