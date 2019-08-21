import {Router} from 'express';

const router = Router();

//Esto corresponde a /dinosaurios
//CUATRO METODOS : get, post, put, delete
router.get('/', (req,res) => {
    return res.send(req.context.models.users[req.context.me.id]);
});

// router.post('/', (req,res) => {
//     return `POST dinosaurios`; 
//     // res.send(req.context.models.users[req.context.me.id]);
// });

// router.put('/', (req,res) => {
//     return res.send(req.context.models.users[req.context.me.id]);
// });

// router.delete('/', (req,res) => {
//     return res.send(req.context.models.users[req.context.me.id]);
// });

export default router;