const Embarcacion = require('../models/Embarcacion');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Embarcacion);
