# Migraciones

## Que son

Las migraciones son especificaciones de una tabla y las relaciones en base de datos. Constan de un comando para crearlas con el nombre de la tabla, sus atributos y otra informacion relevante.

## Para que sirve

Las migraciones van a crear tanto la tabla en la base de datos, como el archivo .js si no existiera

## Que pasa si me olvide agregar un campo o algo asi

Vas a tener que modificar los archivos generados en la carpeta *models*

### Ejemplo de la pagina de sequelize.org

    npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

### Lista de migraciones creadas

    npx sequelize-cli model:generate --name Dinosaurio --attributes nombre:string, fecha_descubierto:date, fecha_alta:date

    npx sequelize-cli model:generate --name Alimentacion --attributes nombre:string

    npx sequelize-cli model:generate --name Periodo --attributes nombre:string

    npx sequelize-cli model:generate --name Alimentacion --attributes nombre:string
