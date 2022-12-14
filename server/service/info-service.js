const { db_insertInfo, db_getInfoById } = require("../db_controller/db_info");
const { sendFirstEmail } = require("./email-service");
const { sendFirstSMS } = require("./sms-service");

const addInfo = async (req, res) => {
  const contactInfo = req.body;
  const id = await db_insertInfo(contactInfo);
  const QRCode = getQRCode(id);
  res.status(200).json({ id: id, info: contactInfo, QRCode: QRCode });
};

const getQRCode = (id) => {
  const prefix = "http://localhost:3000/info/";
  return `https://api.qrserver.com/v1/create-qr-code/?data=${prefix + id}"`;
};

const getInfo = async (req, res) => {
  const id = req.params.id;
  const info = await db_getInfoById(id);
  sendFirstEmail(info);
  sendFirstSMS(info);
  res.status(200).json({ info: info });
};

const sendAlert = async (req, res) => {
  const alert = req.body;
  sendFirstEmail(alert);
  sendFirstSMS(alert);
  res.status(200).json({ msg: "Custom alter sent!" });
};

module.exports = { addInfo, getInfo, sendAlert };
