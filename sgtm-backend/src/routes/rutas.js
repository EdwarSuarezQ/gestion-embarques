const express = require("express");
const router = express.Router();
const controller = require("../controllers/rutasController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.create);
router.get("/", auth, controller.list);
router.get("/estadisticas", auth, controller.stats);
router.get("/activas", auth, async (req, res, next) => {
  try {
    const items = await require("../models/Ruta").find({ estado: "active" });
    return require("../utils/apiResponse").success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get("/tipo/:tipo", auth, async (req, res, next) => {
  try {
    const items = await require("../models/Ruta").find({
      tipo: req.params.tipo,
    });
    return require("../utils/apiResponse").success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get("/origen/:ciudad", auth, async (req, res, next) => {
  try {
    const items = await require("../models/Ruta").find({
      origen: new RegExp(req.params.ciudad, "i"),
    });
    return require("../utils/apiResponse").success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get("/internacionales", auth, async (req, res, next) => {
  try {
    const items = await require("../models/Ruta").find({
      tipo: "international",
    });
    return require("../utils/apiResponse").success(res, items);
  } catch (err) {
    next(err);
  }
});
router.put("/:id/estado", auth, async (req, res, next) => {
  try {
    const ruta = await require("../models/Ruta").findById(req.params.id);
    if (!ruta)
      return require("../utils/apiResponse").notFound(
        res,
        "Ruta no encontrada"
      );
    ruta.estado = req.body.estado;
    await ruta.save();
    return require("../utils/apiResponse").success(
      res,
      ruta,
      "Estado actualizado"
    );
  } catch (err) {
    next(err);
  }
});

router.get("/:id", auth, controller.get);
router.put("/:id", auth, controller.update);
router.patch("/:id", auth, controller.patch);
router.delete("/:id", auth, controller.remove);

module.exports = router;
