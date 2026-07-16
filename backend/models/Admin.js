const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { createLocalModel, syncMongoCollection } = require("../services/localStorageService");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Admin",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

adminSchema.post("save", async () => {
  await syncMongoCollection(mongoose.model("Admin"), "admins.json");
});

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = createLocalModel(AdminModel, "admins.json", {
  name: "Admin",
}, {
  async beforeSave(admin) {
    if (admin.password && !admin.password.startsWith("$2")) {
      admin.password = await bcrypt.hash(admin.password, 12);
    }
  },
  async matchPassword(password) {
    return bcrypt.compare(password, this.password);
  },
});
