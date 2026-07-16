const mongoose = require("mongoose");
const { syncMongoCollection } = require("../services/localStorageService");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MongoDB is not configured. Using local JSON storage.");
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected Host:", conn.connection.host);
    console.log("Database Name:", conn.connection.name);
    console.log("Connection Ready State:", conn.connection.readyState);
    const Student = require("../models/Student");
    const Admin = require("../models/Admin");
    const Gyapan = require("../models/Gyapan");
    await Promise.all([
      syncMongoCollection(Student.nativeModel, "students.json"),
      syncMongoCollection(Admin.nativeModel, "admins.json"),
      syncMongoCollection(Gyapan.nativeModel, "gyapan.json"),
    ]);
    return true;
  } catch (error) {
    console.warn("MongoDB unavailable. Using local JSON storage:", error.message);
    return false;
  }
};

module.exports = connectDB;
