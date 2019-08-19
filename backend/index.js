import 'dotenv/config'; //esto debe ir siempre primero
import cors from 'cors';
import express from 'express';

console.log("MEF --- Iniciando server");

const app = express();

app.use(cors());
//get vacio
app.get('/dinosaurios', (req,res) => {
    return res.send('dinosaurios GET');
});
//get con parametro
app.get('/dinosaurios/:dinoId', (req,res) => {
    return res.send(`dinosaurios GET con id : ${req.params.dinoId}`);
});
app.post('/dinosaurios',(req,res)=>{
    return res.send('dinosaurios POST');
});
app.put('/dinosaurios',()=>{
    return res.send('dinosaurios PUT');
});
app.delete('/dinosaurios',()=>{
    return res.send('dinosaurios DELETE');
})



app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Listo, escuchando en el puerto ${process.env.EXPRESS_PORT}`);
}
);

// console.log(process.env.PWD_SECRET);