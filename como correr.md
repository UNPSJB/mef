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

En docker (suponiendo que el container se llame mef_app_1)
```
  sudo docker exec mef_app_1 npx sequelize-cli db:seed:all
  sudo docker exec mef_app_1 npx sequelize-cli db:drop
  sudo docker exec mef_app_1 npx sequelize-cli db:create
```