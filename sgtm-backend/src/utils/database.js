const mongoose = require('mongoose');

async function connectDB(uri) {
  const opts = { useNewUrlParser: true, useUnifiedTopology: true };
  return mongoose.connect(uri, opts);
}

module.exports = { connectDB };
