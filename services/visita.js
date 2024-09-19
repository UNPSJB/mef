const models = require('../models');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Guium.Persona.identificacion') {
      return literal(`"Guium->Persona"."identificacion" ILIKE '%${search}%'`);
    } else if (field === 'Guium.Persona.nombre') {
      return literal(`"Guium->Persona"."nombre" ILIKE '%${search}%'`);
    } else if (field === 'Guium.Persona.apellido') {
      return literal(`"Guium->Persona"."apellido" ILIKE '%${search}%'`);
    } else if (field === 'Cliente.Persona.identificacion') {
      return literal(`"Cliente->Persona"."identificacion" ILIKE '%${search}%'`);
    } else if (field === 'Cliente.Persona.nombre') {
      return literal(`"Cliente->Persona"."nombre" ILIKE '%${search}%'`);
    } else if (field === 'Cliente.Persona.apellido') {
      return literal(`"Cliente->Persona"."apellido" ILIKE '%${search}%'`);
    } else if (field === 'fechaVisita') {
      // Buscar utilizando el formato DD/MM/YYYY
      return literal(`TO_CHAR("Visita"."fechaVisita", 'DD/MM/YYYY') ILIKE '%${search}%'`);
    } else if (field === 'Exhibicion.nombre') {
      return literal(`"Exhibicion"."nombre" ILIKE '%${search}%'`);
    } else if (field !== 'id') {
      return literal(`"Visita"."${field}"::text ILIKE '%${search}%'`);
    } else {
      return literal(`"Visita"."id"::text ILIKE '%${search}%'`);
    }
  });
};
module.exports = {
  getAllVisitas(args, opts = {}) {
    return models.Visita.findAll({
      where: {
        ...args,
      },
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
      ...opts,
    });
  },
  async verificarVisitas(fecha) {
    try {
      // Convertir la fecha al formato ISO (YYYY-MM-DD)
      const fechaISO = new Date(fecha).toISOString().split('T')[0];

      // Consultar todas las visitas no canceladas para la fecha proporcionada
      const visitas = await models.Visita.findAll({
        where: {
          fechaVisita: fechaISO,
          estado: 'Pendiente',
        },
      });

      // Horarios disponibles inicialmente de 9 a 18 hs (asumiendo horas completas)
      const horariosDisponibles = [
        '09:00hs',
        '10:00hs',
        '11:00hs',
        '12:00hs',
        '13:00hs',
        '14:00hs',
        '15:00hs',
        '16:00hs',
        '17:00hs',
        '18:00hs',
      ];

      // Extraer los horarios ocupados
      const horariosOcupados = visitas.map(visita => visita.horario);

      // Filtrar los horarios disponibles para excluir los ocupados
      const horariosFinales = horariosDisponibles.filter(horario => !horariosOcupados.includes(horario));

      // Devolver los horarios disponibles
      return horariosFinales;
    } catch (error) {
      console.error('Error al verificar visitas:', error);
      return []; // Devuelve una lista vacía en caso de error
    }
  },
  async verificarVisitasEditar(fecha, horario) {
    try {
      // Convertir la fecha al formato ISO (YYYY-MM-DD)
      const fechaISO = new Date(fecha).toISOString().split('T')[0];

      // Consultar todas las visitas no canceladas para la fecha proporcionada
      const visitas = await models.Visita.findAll({
        where: {
          fechaVisita: fechaISO,
          estado: 'Pendiente',
        },
      });

      // Horarios disponibles inicialmente de 9 a 18 hs (asumiendo horas completas)
      const horariosDisponibles = [
        '09:00hs',
        '10:00hs',
        '11:00hs',
        '12:00hs',
        '13:00hs',
        '14:00hs',
        '15:00hs',
        '16:00hs',
        '17:00hs',
        '18:00hs',
      ];

      // Extraer los horarios ocupados
      const horariosOcupados = visitas.map(visita => visita.horario);

      // Filtrar los horarios disponibles para excluir los ocupados
      const horariosFinales = horariosDisponibles.filter(horario => !horariosOcupados.includes(horario));
      const horariosFinalesEditar = [...horariosFinales, horario];
      const horariosOrdenados = horariosFinalesEditar.sort((a, b) => {
        const convertirHorario = hora => parseInt(hora.replace('hs', '').replace(':', ''), 10);
        return convertirHorario(a) - convertirHorario(b);
      });

      return horariosOrdenados;
    } catch (error) {
      console.error('Error al verificar visitas:', error);
      return []; // Devuelve una lista vacía en caso de error
    }
  },
  async getAniosVisitas() {
    const [result] = await models.sequelize.query(
      `SELECT DISTINCT EXTRACT(YEAR FROM "Visita"."fechaVisita") AS year
       FROM "Visita"
       WHERE EXTRACT(YEAR FROM "Visita"."fechaVisita") <= EXTRACT(YEAR FROM CURRENT_DATE)
       ORDER BY year DESC`
    );
    return result.map(row => row.year);
  },
  async cancelarVisita(id) {
    try {
      const visita = await models.Visita.findByPk(id);
      if (!visita) {
        throw new Error('Visita no encontrada');
      }
      visita.estado = 'Cancelada';
      visita.cancelada = true;
      await visita.save();
    } catch (error) {
      console.error('Error al cancelar la visita:', error);
      throw error;
    }
  },

  async finalizarVisita(id) {
    try {
      const visita = await models.Visita.findByPk(id);
      if (!visita) {
        throw new Error('Visita no encontrada');
      }
      visita.estado = 'Finalizada';
      await visita.save();
    } catch (error) {
      console.error('Error al finalizar la visita:', error);
      throw error;
    }
  },

  async getVisitasPrimerAnio() {
    const anios = await this.getAniosVisitas();
    let anio = anios[0];
    let year = anio;
    try {
      // Realiza la consulta a la base de datos
      const result = await models.sequelize.query(
        `WITH meses AS (
          SELECT generate_series(1, 12) AS mes
        ),
        visitas AS (
          SELECT 
            EXTRACT(MONTH FROM "fechaVisita") AS mes,
            COUNT(*) FILTER (WHERE estado = 'Cancelada') AS total_canceladas,
            COUNT(*) FILTER (WHERE estado = 'Finalizada') AS total_finalizadas
          FROM "Visita"
          WHERE EXTRACT(YEAR FROM "fechaVisita") = :anio
          GROUP BY mes
        )
        SELECT 
          m.mes,
          COALESCE(v.total_canceladas + v.total_finalizadas, 0) AS total_visitas,
          COALESCE(v.total_finalizadas, 0) AS total_finalizadas
        FROM meses m
        LEFT JOIN visitas v ON m.mes = v.mes
        ORDER BY m.mes ASC;`,
        {
          replacements: { anio: year },
          type: models.sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );

      // Verifica si result es un array
      if (!Array.isArray(result)) {
        throw new Error('El resultado no es un array');
      }

      // Procesa los datos del resultado
      const totalVisitas = [];
      const visitasFinalizadas = [];

      result.forEach(row => {
        totalVisitas.push(parseInt(row.total_visitas, 10) || 0);
        visitasFinalizadas.push(parseInt(row.total_finalizadas, 10) || 0);
      });
      return { totalVisitas, visitasFinalizadas };
    } catch (error) {
      console.error('Error al obtener visitas:', error);
      throw error;
    }
  },
  async getVisitasAnio(anio) {
    const anios = await this.getAniosVisitas();
    let primerAnio = anios[0];
    let year = anio || primerAnio;

    try {
      // Realiza la consulta a la base de datos
      const result = await models.sequelize.query(
        `WITH meses AS (
          SELECT generate_series(1, 12) AS mes
        ),
        visitas AS (
          SELECT 
            EXTRACT(MONTH FROM "fechaVisita") AS mes,
            COUNT(*) FILTER (WHERE estado = 'Cancelada') AS total_canceladas,
            COUNT(*) FILTER (WHERE estado = 'Finalizada') AS total_finalizadas
          FROM "Visita"
          WHERE EXTRACT(YEAR FROM "fechaVisita") = :anio
          GROUP BY mes
        )
        SELECT 
          m.mes,
          COALESCE(v.total_canceladas + v.total_finalizadas, 0) AS total_visitas,
          COALESCE(v.total_finalizadas, 0) AS total_finalizadas
        FROM meses m
        LEFT JOIN visitas v ON m.mes = v.mes
        ORDER BY m.mes ASC;`,
        {
          replacements: { anio: year },
          type: models.sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );

      // Verifica si result es un array
      if (!Array.isArray(result)) {
        throw new Error('El resultado no es un array');
      }

      // Procesa los datos del resultado
      const totalVisitas = [];
      const visitasFinalizadas = [];

      result.forEach(row => {
        totalVisitas.push(parseInt(row.total_visitas, 10) || 0);
        visitasFinalizadas.push(parseInt(row.total_finalizadas, 10) || 0);
      });
      return { totalVisitas, visitasFinalizadas };
    } catch (error) {
      console.error('Error al obtener visitas:', error);
      throw error;
    }
  },

  async getEdadesVisitas(anio) {
    const anios = await this.getAniosVisitas();
    let primerAnio = anios[0];
    let year = anio || primerAnio;

    try {
      const result = await models.sequelize.query(
        `
        WITH meses AS (
          SELECT generate_series(1, 12) AS mes
        ),
        visitas AS (
          SELECT 
            EXTRACT(MONTH FROM "fechaVisita") AS mes,
            COUNT(*) FILTER (WHERE estado = 'Finalizada') AS total_finalizadas,
			COUNT(*) FILTER (WHERE AGE(p.fecha_nacimiento) >= INTERVAL '0 years' AND AGE(p.fecha_nacimiento) <= INTERVAL '35 years') as grupo_18_a_35,
			COUNT(*) FILTER (WHERE AGE(p.fecha_nacimiento) >= INTERVAL '35 years' AND AGE(p.fecha_nacimiento) <= INTERVAL '55 years') as grupo_36_a_55,
			COUNT(*) FILTER (WHERE AGE(p.fecha_nacimiento) >= INTERVAL '55 years') as grupo_55_o_mas
          FROM "Visita"
		  INNER JOIN "Clientes" c ON c.id = "Visita"."ClienteId"
		  INNER JOIN "Personas" p ON p.id = c."PersonaId"
          WHERE EXTRACT(YEAR FROM "fechaVisita") = :anio
		  AND estado = 'Finalizada' -- esto revisar
          GROUP BY mes
        )
        SELECT 
          m.mes,
          v.grupo_18_a_35,
          v.grupo_36_a_55,
          v.grupo_55_o_mas,
          v.total_finalizadas
        FROM meses m
        LEFT JOIN visitas v ON m.mes = v.mes
        ORDER BY m.mes ASC;
        `,
        {
          replacements: { anio: year },
          type: models.sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );

      // Verifica si result es un array
      if (!Array.isArray(result)) {
        throw new Error('El resultado no es un array');
      }

      // Procesa los datos del resultado
      const visitas18a35 = [];
      const visitas35a55 = [];
      const visitas55omas = [];

      result.forEach(row => {
        visitas18a35.push(parseInt(row.grupo_18_a_35, 10) || 0);
        visitas35a55.push(parseInt(row.grupo_36_a_55, 10) || 0);
        visitas55omas.push(parseInt(row.grupo_55_o_mas, 10) || 0);
      });

      return {
        visitas18a35,
        visitas35a55,
        visitas55omas,
      };
    } catch (error) {
      console.error('Error al obtener visitas:', error);
      throw error;
    }
  },
  async getVisitasDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      querySearch = {
        [Op.or]: genericSearch(search, [
          'id',
          'Cliente.Persona.identificacion',
          'Guium.Persona.identificacion',
          'Cliente.Persona.nombre',
          'Cliente.Persona.apellido',
          'Guium.Persona.nombre',
          'Guium.Persona.apellido',
          'fechaVisita',
          'Exhibicion.nombre',
          'observacion',
          'precio',
          'horario',
          'estado',
        ]),
      };
    }

    // Contar el número de registros filtrados
    const recordsFiltered = await models.Visita.count({
      where: querySearch,
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });

    const visitas = await models.Visita.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });

    return { visitas, recordsFiltered };
  },
  countVisitas() {
    return models.Visita.count();
  },
  getVisitas(page = 0, pageSize = 10, args) {
    return models.Visita.findAndCountAll({
      where: {
        ...args,
      },
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
      ...paginateModel({ page, pageSize }),
    });
  },
  getVisita(id, opts = {}) {
    return models.Visita.findOne({
      where: {
        id,
      },
      ...opts,
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });
  },
  createVisita(
    ExhibicionId,
    ClienteId,
    GuiumId,
    cantidadDePersonas,
    fechaVisita,
    horario,
    precio,
    estado,
    observacion
  ) {
    return models.Visita.create({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      estado,
      observacion,
      cancelada: false,
    });
  },
  async updateVisita(
    id,
    ExhibicionId,
    ClienteId,
    GuiumId,
    cantidadDePersonas,
    fechaVisita,
    horario,
    precio,
    estado,
    observacion,
    cancelada = false
  ) {
    const visita = await models.Visita.findByPk(id);

    return visita.update({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      estado,
      observacion,
      cancelada,
    });
  },
};
