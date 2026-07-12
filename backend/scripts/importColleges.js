const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

const College = require("../models/College");


const colleges = [];

fs.createReadStream(path.join(__dirname, "../data/UniversityList.csv"))
  .pipe(csv())
  .on("data", (row) => {

        if (row._0) {
            colleges.push({
                name: row._0.trim(),
            });
        }
    })
  .on("end", async () => {
    try {
      await College.deleteMany();

      await College.insertMany(colleges, {
        ordered: false,
      });

      console.log(`✅ ${colleges.length} colleges imported successfully.`);

      mongoose.connection.close();
    } catch (err) {
      console.log(err);
      mongoose.connection.close();
    }
  });