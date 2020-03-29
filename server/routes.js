const express = require("express");
const router = express.Router();
const RecordsController = require("./controllers/records.controller");
// Records
router
  .route("/records")
  .post(RecordsController.recordItem)
  .get(RecordsController.getRecords);
router.route("/records/:id").put(RecordsController.updateRecords);

module.exports = router;
