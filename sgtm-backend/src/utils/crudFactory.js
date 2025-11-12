// Factory para crear controladores CRUD básicos para un modelo Mongoose
const apiResponse = require('./apiResponse');

function crudFactory(Model) {
  return {
    create: async (req, res, next) => {
      try {
        const item = new Model(req.body);
        await item.save();
        return apiResponse.success(res, item, 'Creado', 201);
      } catch (err) {
        next(err);
      }
    },
    list: async (req, res, next) => {
      try {
        const { page = 1, limit = 10, sort = '-createdAt', q } = req.query;
        const filters = {};
        if (q) {
          // busqueda generica en campos string: busca en cada key string
          const or = [];
          Object.keys(Model.schema.paths).forEach((key) => {
            if (['String'].includes(Model.schema.paths[key].instance))
              or.push({ [key]: new RegExp(q, 'i') });
          });
          if (or.length) filters.$or = or;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [items, total] = await Promise.all([
          Model.find(filters).sort(sort).skip(skip).limit(parseInt(limit)),
          Model.countDocuments(filters),
        ]);
        return apiResponse.success(res, {
          items,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
        });
      } catch (err) {
        next(err);
      }
    },
    get: async (req, res, next) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return apiResponse.notFound(res, 'No encontrado');
        return apiResponse.success(res, item);
      } catch (err) {
        next(err);
      }
    },
    update: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return apiResponse.notFound(res, 'No encontrado');
        return apiResponse.success(res, item, 'Actualizado');
      } catch (err) {
        next(err);
      }
    },
    patch: async (req, res, next) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return apiResponse.notFound(res, 'No encontrado');
        Object.assign(item, req.body);
        await item.save();
        return apiResponse.success(res, item, 'Parcialmente actualizado');
      } catch (err) {
        next(err);
      }
    },
    remove: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return apiResponse.notFound(res, 'No encontrado');
        return apiResponse.success(res, {}, 'Eliminado');
      } catch (err) {
        next(err);
      }
    },
    stats: async (req, res, next) => {
      try {
        const total = await Model.countDocuments();
        return apiResponse.success(res, { total });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = crudFactory;
