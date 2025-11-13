const express = require("express");
const router = express.Router();
const controller = require("../controllers/estadisticasController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getEstadisticas);
router.get("/periodo/:periodo", auth, controller.getEstadisticasPorPeriodo);
router.get("/tipo/:tipo", auth, controller.getEstadisticasPorTipo);

module.exports = router;
