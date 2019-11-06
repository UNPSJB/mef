const models = require('../models');

module.exports = {
  getPedidos(args) {
    return models.Pedido.findAll({
      include: [models.Persona],
      where:{
        ...args
      },
      order:[
        ['createdAt', 'DESC']
      ] 
    })
  },
  getPedido(args) {
    return models.Pedido.findOne({
      where : {
        ...args
      },
      include: [models.Persona]
    })
  },
  solicitar(huesos){
    return models.Pedido.create({
      autorizacion:true,
      tipo: 'Interno',
      estadoInstance: 'Confirmado'
    }).then(pedido=>{
      pedido.crearDetalles(huesos,pedido.id)
    })
  },
  presupuestar(
    huesos,
    cliente,
    descripcion,
    monto,
    fecha_fin_oferta
  ) {
    //crea el pedido y sus detalles
    return models.Pedido.create({
        tipo:'Externo',
        estadoInstance: 'Presupuestado', 
        PersonaId:null, //@TODO aca va cliente
      })
      .then(pedido => {
        //una vez que hayas creado el presupuesto
        //agregarle todos sus ddetalles
        pedido.crearDetalles(huesos);
      });
  },
  updatePedido(pedido) {
    return models.Pedido.upsert(pedido);
  },
  deletePedido() {}
};
