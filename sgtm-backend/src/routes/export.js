const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const exportController = require("../controllers/exportController");

router.get("/tipos", auth, exportController.getTiposReporte);

router.post("/generar", auth, exportController.generarReporte);

module.exports = router;
