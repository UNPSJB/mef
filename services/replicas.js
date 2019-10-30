const models = require("../models");
let dino = models.Dinosaurio;
let pedido = models.Pedido;
let detalle = models.Detalle;
let confirmado = models.Confirmado;
let presupuesto = models.Presupuestado;
let persona = models.Persona;
const Pedido = require('../models/replicacion/pedido');


module.exports = {
  getPedidos(args) {
    return pedido.findAll({
      include: [persona],
      where: {
        ...args
      }
    });
  },
  getPedido(args) {
    return pedido.findOne({
      where : {
        ...args
      },
      include: [persona]
    })
  },
  createPedido(tipo, dinosaurio, huesos) {
    //crea el pedido y sus detalles
    return Pedido.solicitar(null,null).then((res)=>{
      console.log("res")
    }).catch(e=>{
      console.log("sale mal")
    });
      // .create({
      //   tipo
      // })
      // .then(pedido => {
      //   //cuando hayas creado el pedido
      //   //si sos interno ...
      //   //crear confirmado
      //   confirmado.create({
      //     PedidoId: pedido.id
      //   });
      // });
  },
  createPedido(
    tipo,
    dinosaurio,
    huesos,
    cliente,
    descripcion,
    monto,
    finoferta
  ) {
    //crea el pedido y sus detalles
    return pedido
      .create({
        tipo
      })
      .then(pedido => {
        //cuando hayas creado el pedido
        //si sos externo
        //crear presupuesto
        presupuesto.create({
          PedidoId: pedido.id
        });
      });
  },
  updatePedido() {},
  deletePedido() {}
};
