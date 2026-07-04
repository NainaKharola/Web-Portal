const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected Host:", conn.connection.host);
    console.log("Database Name:", conn.connection.name);
    console.log("Connection Ready State:", conn.connection.readyState);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;