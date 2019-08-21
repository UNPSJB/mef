

const dinosaurio = ( sequelize, DataTypes ) => {
    //escrito en minusculas entre comillas simples
    const Dinosaurio = sequelize.define('dinosaurio',{
        id:{
            type:DataTypes.INTEGER,
            unique:true,
            primaryKey:true,
        },
        nombre:{
            type:DataTypes.STRING            
        },
    });

    // Dinosaurio.associate = models => {
    //     Dinosaurio.hasOne(models.Clase);
    // };

    return Dinosaurio; 
};

export default dinosaurio;