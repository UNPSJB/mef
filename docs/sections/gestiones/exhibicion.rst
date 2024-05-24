Jefe de Exhibición
==================

Bienvenido a la Gestión de Exhibición. En esta sección usted podrá administrar todo lo referido a:

*  Clientes del mueso

*  Exhibiciones 

*  Pedidos de replicación de fósiles

.. image:: ../images/exhibicion/Bienvenida
   :width: 800

Si desea agregar un elemento nuevo, haga click en el símbolo '+'. 

.. image:: ../images/+
   :width: 50

   Puede seleccionar el símbolo 'lápiz' para poder editar su información general.

.. image:: ../images/lapiz
   :width: 50

Puede seleccionar el símbolo 'basura' para poder eliminar un elemento.

.. image:: ../images/basura
   :width: 50

Si desea exportar un el presente listado puede hacerlo seleccionando entre 'Excel', 'PDF', o 'CSV'

.. image:: ../images/exportar
   :width: 200


Pedidos
_______
Esta es la sección de Pedidos de réplicas.

Los pedidos de fabricación se dividen en Externos e Internos; dependiendo el tipo de pedidos, será
la secuencia de cambios de estado.

Si el pedido es interno:

* El pedido se creará con el estado "Confirmado" y solo se podrá pasar a los siguientes estados desde la gestión de taller.

* La gestión de taller podrá pasar el pedido de "Confirmado" a "Fabricando", cuando se empiece a fabricar.

* El taller podrá pasarlo al Estado "Demorado", en caso de demora; y viceversa, en caso de reanudación.

* Aunque no es un cambio de estado, vale aclarar que, también se podrá cambiar la asignación de empleados de taller encargados de ese pedido cuando estemos en el estado "Fabricando".

* Por último se podrá pasar al estado "Finalizado" cuando se termine de hacer el pedido.

Si el pedido es externo:

* El pedido se creará con el estado "Presupuestado".

* El pedido se podrá pasar al estado "Cancelado", en caso de que el cliente desee hacerlo.

* Si el pedido se factura, se pasará al estado "Confirmado". A partir de acá, todos los demás cambios de estado solo podrá hacerlos la gestión de taller.

* El taller pasará el pedido a "Fabricando" cuando este empiece a estar en producción.

* También podrá pasarlo al Estado "Demorado", en caso de demora; y viceversa, en caso de reanudación.

* Aunque no es un cambio de estado, vale aclarar que, también se podrá cambiar la asignación de empleados de taller encargados de ese pedido cuando estemos en el estado "Fabricando".

* Se podrá pasar al estado "Finalizado" cuando se termine de hacer el pedido.

* Por último, el taller pasará el pedido al estado "Entregado" cuando le haya llegado el pedido al cliente.

**Pantalla Principal / Listado de Pedidos**

Bienvenido al listado de Pedidos. 
El presente listado le presentará un detalle de todos los pedidos de réplica en la base de datos con sus detalles.

.. image:: ../images/exhibicion/pedidos/ListadoPedidos
   :width: 800


**Crear Pedido de Replicación para Clientes Externos**

El pedido de Replicación de pedidos Externos consiste en pedidos hechos por agentes externos al museo.
Estos pueden ser Clientes Particulaes (personas) o Clientes Institucionales (instituciones).
En cualquiera de los dos casos se carga al cliente en base a su DNI (si es particular) o CUE (si es institucional) de una lista precargada.

.. image:: ../images/exhibicion/pedidos/AgregarPedidoInterno
   :width: 800

**Crear Pedido de Replicación para Clientes Internos**

El pedido de Replicación de pedidos Internos consiste en pedidos hechos por y para el museo. Por lo que no son necesarios los datos del cliente.

.. image:: ../images/exhibicion/pedidos/AgregarPedidoInterno
   :width: 800


La gestión de Exhibición solo puede hacer estos dos pasajes de estados y solo si el pedido es externo.

**Facturar Pedido de Replicación**
La Facturación del Pedido consiste en ver los detalles de lo huesos que se replicarán.
El usuario lo único que podrá editar es, si se realizará un tipo de pago en Efectivo o Cheque.
El valor presupuestado también es ineditable.
Al final, al hacer click en "Facturar", el estado del pedido pasará a "Confirmado" y el navegador
volverá al listado de Pedidos.

.. image:: ../images/exhibicion/pedidos/FacturarPedido
   :width: 800

**Cancelar Pedido de Replicación**
En caso de que el cliente lo desee, la gestión de exhibición podrá cancelar el pedido de replicación siempre y 
cuando este no haya sido Facturado. Una vez facturado, no se podrá cancelar y se procederá a producir.

**(Imagen del Cancelar)**

Antes de cancelar, se podrá ver un detalle del pedido con todos los huesos a replicar y se podrá añadir
una observación (no obligatoria) que se verá en el detalle del estado "Cancelado" dentro del historial de 
cambios de Estado.

.. image:: ../images/exhibicion/pedidos/DetalleCancelado
   :width: 800

**Algunas imágenes ilustrativas:**

Vista del detalle de un pedido confirmado (es decir, creado como Interno):

.. image:: ../images/exhibicion/pedidos/DetalleDePedidoConfirmado
   :width: 800

Vista del historial de cambios de Estado en un pedido:

.. image:: ../images/exhibicion/pedidos/CambiosDeEstado
   :width: 800

Detalles de los distintos Estados del pedido visto desde el historial:

.. image:: ../images/exhibicion/pedidos/Facturado
   :width: 800

.. image:: ../images/exhibicion/pedidos/Entregado
   :width: 800

   **(después poner las demás imágenes)**
   


**Vistas de Detalles de los Pedidos (Necesito el software andando para hacer esta parte)**



Exhibiciones
______________________
Esta es la sección de exhibiciones.
Acá se podrán ver las exhibiciones programadas para el museo.


**Pantalla Principal / Listado**

Bienvenido al listado de Exhibiciones. 
El presente listado le presentará un detalle de todas las exhibiciones con sus respectivos Nombres, Temática, Duración  y la posibilidad  de ver sus Detalles; también tendrá la posibilidad de eliminar o de editar las mismas.

.. image:: ../images/exhibicion/exhibiciones/ListadoExhibiciones
   :width: 800

**Alta Exhibición**

El Alta de Exhibición consiste en asignarle a la misma:

*  Un Nombre (entre 4 y 50 caracteres)

*  Una Temática (entre 4 y 50 caracteres)

*  Una duración en meses (solo se aceptan números entre 1 y 40 meses).

*  Un Listado de Fósiles disponibles (se pueden agregar más después de creada la exhibición).

*  Un Listado de Réplicas disponibles (se pueden agregar más después de creada la exhibición).

.. image:: ../images/exhibicion/exhibiciones/AltaExhibicion
   :width: 800


**Editar Exhibición**

El Editar Exhibición consiste en poder editarle a la misma:

*  El Nombre (entre 4 y 50 caracteres)

*  La Temática (entre 4 y 50 caracteres)

*  La duración en meses (solo se aceptan números entre 1 y 40 meses).

*  El Listado de Fósiles disponibles (se pueden agregar más después de creada la exhibición).

*  El Listado de Réplicas disponibles (se pueden agregar más después de creada la exhibición).

.. image:: ../images/exhibicion/exhibiciones/EditarExhibicion
   :width: 800


**Eliminar Exhibición**

Esta es la sección dedicada a eliminar exhibiciones.

Seleccione la exhibición que desee eliminar y aparecerá una mensaje de confirmación. Si acepta, se eliminará la exhibición, si cancela, no se eliminará y volverá al listado de exhibiciones.

(Acá iría la imagen pero falta el "Cancelar" de la pantalla de eliminación)

Clientes
________
Esta es la sección de Cliente. Aquí podrá Agregar, Editar o Eliminar a los clientes del museo en la base de datos.

* **Listado de Clientes**

Este es el listado de Clientes. Aquí podrá ver el listado de todos los clientes cargados en el sistema con sus detalles, 
con la posibilidad de editarlos o eliminarlos.

.. image:: ../images/exhibicion/clientes/ListadoClientes
   :width: 800


* **Agregar Clientes**

En este apartado usted podrá agregar clientes a la base de datos del museo.
Los datos a cargar sobre el cliente serán:

*  Número de documento (solo números)

*  Nombre (entre 1 y 50 caracteres)

*  Apellido (entre 1 y 50 caracteres)

*  Dirección (Entre 5 y 140 caracteres)

*  Localidad (entre 4 y 50 caracteres)

*  Fecha de Nacimiento (el calendario está programado de forma que el cliente tenga 18 o más años)

*  Número de teléfono (entre 6 y 50 caracteres)

*  Si es un cliente Particular o Institucional.

.. image:: ../images/exhibicion/clientes/AgregarCliente
   :width: 800

* **Editar Clientes**

En esta sección podremos editar los datos del Cliente, tales como:

*  Número de documento (solo números)

*  Nombre (entre 1 y 50 caracteres)

*  Apellido (entre 1 y 50 caracteres)

*  Dirección (Entre 5 y 140 caracteres)

*  Localidad (entre 4 y 50 caracteres)

*  Fecha de Nacimiento (el calendario está programado de forma que el cliente tenga 18 o más años)

*  Número de teléfono (entre 6 y 50 caracteres)

*  Si es un cliente Particular o Institucional.

Todos los campos son obligatorios.

.. image:: ../images/exhibicion/clientes/EditarCliente
   :width: 800


* **Eliminar Clientes (Necesito el software andando para hacer esta parte)**
Esta es la sección dedicada a eliminar clientes.

Seleccione al cliente que desee eliminar y aparecerá una mensaje de confirmación. Si acepta, se eliminará al cliente.

.. image:: ../images/exhibicion/clientes/EliminarCliente
   :width: 800
