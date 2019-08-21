import clase from "./clase";

const alimentacion = ( sequelize, DataTypes ) => {
    const Alimentacion = sequelize.define('alimentacion',{
        id:{
            type:DataTypes.INTEGER,
            unique:true,
            primaryKey:true,
        },
        nombre:{
            type:DataTypes.STRING            
        },
    });
    
    Alimentacion.associate = models => {
        Alimentacion.hasOne(models.Dinosaurio);
    }

    return Alimentacion;
};

export default alimentacion;