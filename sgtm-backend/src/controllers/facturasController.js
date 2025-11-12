const Factura = require('../models/Factura');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Factura);
