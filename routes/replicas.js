const express = require("express");
const permisos = require('../auth/permisos');
const router = express.Router();

router.get("/",
    permisos.permisoPara([permisos.ROLES.EXHIBICION, permisos.ROLES.TALLER]),
    (req, res, next) => {
        replicaService.getReplicas().then(results => {
            res.render("replicas/replica", {
                results
            });
        });
    });

router.get("/editar/:id",
    permisos.permisoPara([permisos.ROLES.EXHIBICION]),
    async (req, res, next) => {
        const { id } = req.params;
        const replica = await replicaService.getReplica(id);
        //PUEDE QUE FALTE DINOSAURIO,HUESO,PEDIDO
        res.render("fosiles/editar", { replica });
    });

router.get("/eliminar/:id",
    permisos.permisoPara([permisos.ROLES.EXHIBICION]),
    (req, res, next) => {
        const { id } = req.params;
        replicaService
            .getReplica(id)
            .then(replica => res.render("replicas/eliminar", { replica }))
            .catch(err => {

            });
    });

router.delete("/",
    permisos.permisoPara([permisos.ROLES.EXHIBICION]),
    (req, res, next) => {
        replicaService.deleteReplica(req.body.id).then(() => res.redirect("/replicas"));
    });

router.post("/",
    permisos.permisoPara([permisos.ROLES.EXHIBICION]),
    (req, res, next) => {
        const {
            codigo,
            disponible,
            fecha_inicio,
            fecha_fin,
            fecha_baja,
            obs,
            PedidoId,
            HuesoId,
            DinosaurioId
        } = req.body;
        
    })