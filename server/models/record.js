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
const zoomLevelToRadius = {
  "20": 1128.49722,
  "19": 2256.99444,
  "18": 4513.98888,
  "17": 9027.977761,
  "16": 18055.95552,
  "15": 36111.91104,
  "14": 72223.82209,
  "13": 144447.6442,
  "12": 288895.2884,
  "11": 577790.5767,
  "10": 1155581.153,
  "9": 2311162.307,
  "8": 4622324.614,
  "7": 9244649.227,
  "6": 18489298.45,
  "5": 36978596.91,
  "4": 73957193.82,
  "3": 147914387.6,
  "2": 295828775.3,
  "1": 591657550.5
};
RecordSchema.index({ location: "2dsphere" });

const Record = mongoose.model("Record", RecordSchema);

module.exports = { Record, symptomMap, cMap, zoomLevelToRadius };
