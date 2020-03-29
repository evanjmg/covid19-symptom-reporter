const { Record } = require("../models/record");
const { getBodyFromTokenHeader, signUser } = require("../utility/auth");
const { logger } = require("../utility/logging");
const request = require("request-promise");

async function recordItem(req, res) {
  try {
    const body = { ...req.body };
    if (
      body.captcha === undefined ||
      body.captcha === "" ||
      body.captcha === null
    ) {
      return res
        .status(400)
        .send({ responseCode: 400, errorMessage: "Please select captcha" });
    }
    const secret = process.env.RECAPTCHA_SECRET;
    const verificationUrl =
      `https://www.google.com/recaptcha/api/siteverify?secret=` +
      secret +
      "&response=" +
      body.captcha +
      "&remoteip=" +
      req.connection.remoteAddress;
    try {
      await request(verificationUrl);
    } catch (err) {
      return res.status(403).send({ errorMessage: "Invalid recaptcha" });
    }

    const record = await Record.create(body);
    const jsonRecord = record.toJSON();
    const token = signUser(jsonRecord);

    return res.send({ ...jsonRecord, recordId: Record._id, token });
  } catch (err) {
    if (err && err.message) {
      res.status(403).send({ errorMessage: err.message });
    } else {
      res.sendStatus(500);
    }
    logger.error(err);
  }
}
async function updateRecords(req, res) {
  try {
    const userBody = getBodyFromTokenHeader(req.headers);
    if (!userBody) {
      res.status(403).send({ errorMessage: "Unauthorized action " });
    }
    await Record.update({ _id: req.params.id, ...req.body });
    res.sendStatus(204);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
}
async function getRecords(req, res) {
  try {
    const userBody = getBodyFromTokenHeader(req.headers);
    if (!userBody) {
      return res.status(403).send({ errorMessage: "Unauthorized action " });
      return;
    }
    if (!req.query || !req.query.lat || !req.query.lng) {
      return res.status(400).send({ errorMessage: "Missing Parameters" });
    }

    const { lat, lng } = req.query;
    const records = await Record.find({
      location: {
        $nearSphere: {
          $maxDistance: 1000,
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          }
        }
      }
    });
    return res.send(records);
  } catch (err) {
    console.log(err);
    logger.error(err);
    res.status(500).send({ message: "Server Error" });
  }
}
module.exports = {
  recordItem,
  updateRecords,
  getRecords
};
