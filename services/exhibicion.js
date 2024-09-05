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
  async updateExhibicion(id, nombre, tematica, duracion, fosiles, replicas) {
    const exhibicion = await models.Exhibicion.findByPk(id);

    await exhibicion.update({
      nombre,
      tematica,
      duracion,
    });
    const fosilesActuales = await exhibicion.getFosils();
    const replicasActuales = await exhibicion.getReplicas();
    // primero pongo los fósiles y replicas en disponible verdadero
    await Promise.all(
      fosilesActuales.map(async fosil => {
        return fosil.update({
          disponible: true,
        });
      }),
      replicasActuales.map(async replica => {
        return replica.update({
          disponible: true,
        });
      })
    );
    // los quito de la exhibición
    await exhibicion.setFosils([]);
    await exhibicion.setReplicas([]);

    // luego los pongo en la exhibición para evitar calcular
    // 1. cuales estan en la exhibición y
    // 2. cuales fueron removidos
    if (replicas) {
      const listaDeReplicas = [...replicas];
      await Promise.all(
        listaDeReplicas.map(async replica_id => {
          const replica = await models.Replica.findByPk(replica_id);
          return replica.update({
            disponible: false,
          });
        })
      );
      exhibicion.setReplicas(listaDeReplicas);
    }
    if (fosiles) {
      const listaDeFosiles = [...fosiles];
      Promise.all(
        listaDeFosiles.map(async fosil_id => {
          const fosil = await models.Fosil.findByPk(fosil_id);
          return fosil.update({
            disponible: false,
          });
        })
      );
      exhibicion.setFosils(listaDeFosiles);
    }
  },

  async getFosiles(exhibicion_id) {
    const exhibicion = await models.Exhibicion.findByPk(exhibicion_id);
    return exhibicion.getFosils({
      include: [models.Dinosaurio],
    });
  },

  async getReplicas(exhibicion_id) {
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
