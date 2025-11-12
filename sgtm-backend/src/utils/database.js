const mongoose = require("mongoose");

async function connectDB(uri) {
  console.log("🔌 Conectando a:", uri);

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(uri, opts);
    console.log("✅ MongoDB conectado exitosamente");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:");
    console.error("Mensaje:", error.message);
    throw error;
  }
}

module.exports = { connectDB };
