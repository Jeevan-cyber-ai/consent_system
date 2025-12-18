const mongoose = require("mongoose");

const dataRecordSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  dataType: { type: String },

  data: { type: Object },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DataRecord", dataRecordSchema);
