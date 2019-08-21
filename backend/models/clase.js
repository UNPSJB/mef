const clase = ( sequelize,DataTypes ) =>{
    //escrito en minusculas entre comillas simples
    const Clase = sequelize.define('clase',{
        id:{
            type:DataTypes.INTEGER,
            unique:true,
            primaryKey:true,
        },
        nombre:{
            type:DataTypes.STRING            
        },
    });

    //se hace asi, no al reves
    Clase.associate = models => {
        Clase.hasOne(models.Dinosaurio);
    }

    /**
     * esto podria haber sido
     * Clase.associate = models => Clase.hasMany(models.Subclase)
     */

    // Clase.associate = models => {
    //     Clase.belongsTo(models.Dinosaurio);
    // };
    return Clase; 
};

export default clase;