const mongoose = require("mongoose");
const RecordSchema = new mongoose.Schema(
  {
    c_at: { type: Date, default: Date.now },
    location: {
      type: { type: String, default: "Point" },
      coordinates: []
    },
    status: { type: Number, required: true, enum: [0, 1, 2, 3] },
    cStatus: { type: Number, required: true, enum: [0, 1, 2, 3] }
  },
  { strict: true }
);
const cMap = [
  "I have not been tested or awaiting results",
  "I tested positive for COV-19",
  "I tested negative for COV-19"
];
const symptomMap = [
  "No symptoms",
  "Mild symptoms",
  "Moderate symptoms",
  "Serious symptoms"
];

RecordSchema.index({ location: "2dsphere" });

const Record = mongoose.model("Record", RecordSchema);

module.exports = { Record, symptomMap, cMap };
