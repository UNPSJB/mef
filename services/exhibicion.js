const models = require('../models');
const { paginateModel } = require('./utils');

module.exports = {
  getAllExhibiciones(args = {}, opts = {}) {
    return models.Exhibicion.findAll({
      where: {
        ...args,
      },
      ...opts,
    });
  },
  getExhibiciones(page = 0, pageSize = 10, args) {
    return models.Exhibicion.findAndCountAll({
      where: {
        ...args,
      },
      ...paginateModel({ page, pageSize }),
    });
  },
  getExhibicion(id, args = {}) {
    return models.Exhibicion.findByPk(id, { ...args });
  },

  async createExhibicion(nombre, tematica, duracion, fosiles, replicas) {
    const exhibicion = await models.Exhibicion.create({
      nombre,
      tematica,
      duracion,
    });

    //Revisar este comportamiento
    if (fosiles) {
      //si hay fósiles, ponerlos como no disponibles
      const listaDeFosiles = [...fosiles];
      listaDeFosiles.every(async fosil_id => {
        let fosil = await models.Fosil.findByPk(fosil_id);
        fosil.update({
          disponible: false,
        });
      });
      exhibicion.setFosils(listaDeFosiles);
    }
    if (replicas) {
      const listaDeReplicas = [...replicas];
      listaDeReplicas.every(async replica_id => {
        let replica = await models.Replica.findByPk(replica_id);
        replica.update({
          disponible: false,
        });
      });
      exhibicion.setReplicas(listaDeReplicas);
    }

    return exhibicion;
  },
  /*@TODO poner replicas y fósiles en disponible verdadero cuando ya no estés en una exhibición. */
  updateExhibicion(id, nombre, tematica, duracion, fosiles, replicas) {
    return models.Exhibicion.findByPk(id).then(e => {
      return e
        .update({
          nombre,
          tematica,
          duracion,
        })
        .then(exhibicion => {
          if (replicas) {
            const listaDeReplicas = [...replicas];
            listaDeReplicas.every(async replica_id => {
              let replica = await models.Replica.findByPk(replica_id);
              replica.update({
                disponible: false,
              });
            });
            console.log('replicas', listaDeReplicas);
            exhibicion.setReplicas(listaDeReplicas);
          }
          if (fosiles) {
            const listaDeFosiles = [...fosiles];
            listaDeFosiles.every(async fosil_id => {
              let fosil = await models.Fosil.findByPk(fosil_id);
              fosil.update({
                disponible: false,
              });
            });
            exhibicion.setFosils(listaDeFosiles);
          }
        });
    });
  },

  async getFosiles(exhibicion_id) {
    const exhibicion = await models.Exhibicion.findByPk(exhibicion_id);
    return exhibicion.getFosils({
      include: [models.Dinosaurio],
    });
  },

  async getReplicas(exhibicion_id, options = []) {
    const exhibicion = await models.Exhibicion.findByPk(exhibicion_id);
    return exhibicion.getReplicas({
      include: [models.Hueso, models.Dinosaurio],
    });
  },

  async deleteExhibicion(id) {
    const exhibicion = await models.Exhibicion.findByPk(id);
    const fosiles = await exhibicion.getFosils();
    const replicas = await exhibicion.getReplicas();
    await Promise.all(
      fosiles.map(async fosil => {
        fosil.update({
          disponible: true,
        });
      }),
      replicas.map(async replica => {
        replica.update({
          disponible: true,
        });
      })
    );

    await exhibicion.setFosils([]);
    await exhibicion.setReplicas([]);
    return exhibicion.destroy();
  },
};
