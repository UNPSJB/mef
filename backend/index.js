import 'dotenv/config'; //esto debe ir siempre primero
import cors from 'cors';
import express from 'express';
import models, {sequelize} from './models';
import routes from './routes';

console.log("MEF --- Iniciando server");

const app = express();

app.use(cors());

app.use((req,res,next) =>{
    req.context ={
        models,
        me: models.users[1],
    };
    next();
});

app.use('/', routes.dinosaurios);
app.use('/dinosaurios',routes.dinosaurios); //usamos routes/index

// If you want to re-initialize your database on every Express server start, you can add a condition to your sync method:
// const eraseDatabaseOnSync = true;
// sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {


sequelize.sync().then(()=>{
    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`Listo, escuchando en el puerto ${process.env.EXPRESS_PORT}`);
    });
});


// console.log(process.env.PWD_SECRET);