# Info acerca del backend

## Como instalar dependencias

    npm install

## Como correr

    npm start

## Que necesito tener instalado

* NodeJS
* PostgreSQL (una base de datos llamada mef)

## Ejecutar los seeders

Los seeders lo que hacen es: poblar la base de datos, o insertar registros (ademas de otras cosas). Nosotros creamos varios archivos de seeders que van a poblar (o despoblar) nuestra db, hasta ahora los creados son de: roles, subclases. Guia de sequelize : <https://sequelize.org/master/manual/migrations.html>

Ejemplo de generar seed de roles de usuario

```bash
npx sequelize-cli seed:generate --name roles-usuarios
```

Archivo de migraciones

``` javascript
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Rols',[{
      descripcion:'taller',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      descripcion:'coleccion',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      descripcion:'exhibicion',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
  }
};

```

Ejecutar TODAS las seeds:

```bash
    npx sequelize-cli db:seed:all
```

En docker (suponiendo que el container se llame mef-app-1)
``
Pasos, si quiero reiniciar las seeds (primero hay que cerrar el pgAdmin):
1. sudo docker-compose up (para ejecutar el contenedor)

2. sudo docker exec mef-app-1 npx sequelize-cli db:drop (para dropear la BD)

3. sudo docker exec mef-app-1 npx sequelize-cli db:create (para crear la base de datos nueva) 

4. Detener el contenedor.

5. Ejecutar el contenedor de nuevo.

6. sudo docker exec mef-app-1 npx sequelize-cli db:seed:all (para cargar las seeds nuevas)