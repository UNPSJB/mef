Gestón del Jefe de Taller
=========================

Bienvenido a la Gestión de Taller. En esta sección usted podrá ver y editar el listado de Dinosaurios;
podrá hacer un seguimiento de los pedidos de replicación y cambiar su estado; y podrá ver y editar las 
réplicas del museo.

.. image:: ../images/taller/Bienvenido
   :width: 800

Si desea exportar algún listado, puede hacerlo seleccionando entre 'Excel', 'PDF', o 'CSV'

.. image:: ../images/exportar
   :width: 200


Dinosaurios
______________________

**Pantalla Principal / Listado**

El siguiente es un listado de todos los Dinosaurios en la base de datos del museo.
Este listado contiene un detalle: Nombre, Alimentación, Período en que vivió, subclase a la que pertenece
y fecha de descubrimiento.
Cuenta con una herramienta de búsqueda (lupa) con la que podrá filtrar la búsqueda de dinosaurios de acuerdo 
a su nombre, período, alimentación, etc.
También tiene flechas de ordenación al lado del titulo de cada columna que le permitirá ordenar los elementos 
de acuerdo al atributo de dicha columna de forma ascendente o descendete.

.. image:: ../images/taller/dinosaurios/ListadoDinosaurios
   :width: 800

Si desea ver el listado de huesos de un dinosaurio en particular, solo tendrá que hacer click en el símbolo "hueso".

.. image:: ../images/hueso
   :width: 50

Al hacer click en "hueso" se desplegará el siguiente listado que contiene los huesos.El listado se divide en
en las secciones principales del cuerpo del dinosaurio: Cráneo, Tórax, Vertebral, Pelvis, Brazo, Manos, Piernas y Pies.
Si desea, puede colapsar el listado haciendo click en el nombre de la sección del cuerpo (ejemplo, "Cráneo") y podrá
ocultar el listado de huesos de esas sección para tener un vista más organizada.

.. image:: ../images/taller/dinosaurios/ListadoHuesos
   :width: 800

Réplicas
________

**Pantalla Principal / Listado**

El siguiente es un listado con todas las réplicas que se encuentran en la base de datos del museo.
Cuenta con una herramienta de búsqueda (lupa) con la que podrá filtrar la búsqueda de réplicas de acuerdo 
a su ID, Hueso, dinosaurio al que corresponde, etc.
También tiene flechas de ordenación al lado del titulo de cada columna que le permitirá ordenar los elementos 
de acuerdo al atributo de dicha columna de forma ascendente o descendete.

Las réplicas se dividen por número de pedido.
Por ejemplo, en la imagen de abajo se pueden ver 
las réplicas correspondientes al pedido Nº 320 y en el mismo podemos ver, por cada réplica: su número,
el hueso y dinosaurio al que corresponde, la fecha de inicio y finalización de su fabricación, si se
encuentra disponible para exhibición (en color azul, está disponible, en gris, no)y por úlimto la acción 
de eliminarla, si deseamos.

Más abajo podremos pasar a la página siguiente pero dentro del mismo pedido de replicación.

.. image:: ../images/taller/replicas/ListadoReplicas
   :width: 800

**Eliminar Réplica**

Al hacer click en el logo de eliminación, aparecerá la siguiente pantalla con todos los datos de la réplica
a eliminar. Si no desea eliminarla, deberá retroceder desde su navegador a la pantalla del listado.

.. image:: ../images/taller/replicas/EliminarReplica
   :width: 800


Pedidos
_______

Esta es la sección de Pedidos de réplicas.

Los pedidos de fabricación se dividen en Externos e Internos; dependiendo el tipo de pedidos, será
la secuencia de cambios de estado.

Si el pedido es interno:

* El pedido se creará (en la gestión de Exhibición) con el estado "Confirmado" y solo se podrá pasar a los siguientes estados desde la gestión de taller.

* La gestión de taller podrá pasar el pedido de "Confirmado" a "Fabricando", cuando se empiece a fabricar.

* El taller podrá pasarlo al Estado "Demorado", en caso de demora; y viceversa, en caso de reanudación.

* Aunque no es un cambio de estado, vale aclarar que, también se podrá cambiar la asignación de empleados de taller encargados de ese pedido cuando estemos en el estado "Fabricando".

* Por último se podrá pasar al estado "Finalizado" cuando se termine de hacer el pedido.

Si el pedido es externo:

* El pedido se creará (en la gestión de Exhibición) con el estado "Presupuestado".

* El pedido se podrá pasar al estado "Cancelado", en caso de que el cliente desee hacerlo.

* Si el pedido se factura, se pasará al estado "Confirmado". A partir de acá, todos los demás cambios de estado solo podrá hacerlos la gestión de taller.

* El taller pasará el pedido a "Fabricando" cuando este empiece a estar en producción.

* También podrá pasarlo al Estado "Demorado", en caso de demora; y viceversa, en caso de reanudación.

* Aunque no es un cambio de estado, vale aclarar que, también se podrá cambiar la asignación de empleados de taller encargados de ese pedido cuando estemos en el estado "Fabricando".

* Se podrá pasar al estado "Finalizado" cuando se termine de hacer el pedido.

* Por último, el taller pasará el pedido al estado "Entregado" cuando le haya llegado el pedido al cliente.

**Pantalla Principal / Listado**

Bienvenido al listado de Pedidos. 
El presente listado le presentará en detalle todos los pedidos de replicación de fósiles del Museo.
Cuenta con una herramienta de búsqueda (lupa) con la que podrá buscar el pedido de acuerdo 
al dinosaurio, cliente, id, etc.
También tiene flechas de ordenación al lado del titulo de cada columna que le permitirá ordenar los elementos 
de acuerdo al atributo de dicha columna de forma ascendente o descendete.

.. image:: ../images/taller/pedidos/ListadoPedidos
   :width: 800

La gestión de Taller solo puede hacer la siguientes transiciones de estado:

**Fabricar Pedido de Replicación**

En la fabricación del pedido, asignaermos a los empleados que trabajarán en el mismo. Mínimo deben ser 3.
Luego debemos agregar la fecha de inicio de replicación y la fecha estimada de finalización.

.. image:: ../images/taller/pedidos/Fabricar
   :width: 800

**Demorar Pedido de Replicación**

En caso de algún imprevisto que deba demorar la producción de réplicas, existe la opción de notificarlo en el sistema
a través de una estado llamado "Demorado". Hay tres motivos predefinidos (Presupuestario, Falta de  Material, Falta
de Personal), pero en caso de que ningúno de estos sea el motivo del cliente, tenemos la opcion de "Otros" y la opción (no obligatoria)
de poner una aclaración en la observación.

.. image:: ../images/taller/pedidos/Demorar
   :width: 800

**Reanudar Pedido de Replicación**

Cuando la producción de réplicas esté lista para reanudarse, hacemos click en la opción de "Reanudar" que se
encontrará en el pedido demorado y luego nos aparecerá un detalle con todos los huesos del pedido a replicar.
Solo deberemos hacer click en "Reanudar".

.. image:: ../images/taller/pedidos/Reanudar
   :width: 800

**Finalizar Pedido de Replicación**

Cuando se finaliza la creación de réplicas, se deberá poner una fecha de finalizado igual o menor a la fecha actual
y hacer click en "Finalizar" como última transición de estado del pedido (si fue interno, si fue externo se debe entregar).

.. image:: ../images/taller/pedidos/Finalizar
   :width: 800

**Asignación de Empleados.**

La asignación de empleados no es una transición de estados propiamente dicha, pero es una opción que nos da el
sistema para agregar o eliminar empleados a la producción de réplicas, en caso de que, por distintas razones
se deban/puedan asignar más empleados o los actuales no puedan seguir trabajando.

.. image:: ../images/taller/pedidos/Empleados
   :width: 800

**El siguiente estado solo existe si el pedido de replicación es Externo:**

**Entregar Pedido de Replicación**

Cuando se termina la creación de réplicas (y si el pedido fue hecho por un agente externo al museo), se deberá
poner una fecha de envío y una estiamda de llegada para el pedido al cliente.
Se hace click en "Entregar" y termina el ciclo de producción de la réplica.

.. image:: ../images/taller/pedidos/Entregar
   :width: 800


**Detalle del Pedido de Replicación**

Al hacer click en el botón "Detalle" accederá a los detalles del pedido en cuestión.

En la imagen de abajo se puede apreciar el detalle del pedido Nº 321. En el mismo podremos
ver el Estado Actual del pedido, el Cliente solicitante, el Dinosaurio al que corresponde, 
un listado de cada hueso a replicar, y un registro con todos los cambios de estado, su fecha
correspondiente y la opción de ver los detalles de cada estado.

.. image:: ../images/taller/pedidos/DetallePedido
   :width: 800

**Vista del historial de cambios de Estado en un pedido:**

.. image:: ../images/exhibicion/pedidos/CambiosDeEstado
   :width: 800

**Detalles de los distintos Estados del pedido visto desde el historial:**

.. image:: ../images/exhibicion/pedidos/Presupuestado
   :width: 800

.. image:: ../images/exhibicion/pedidos/Facturado
   :width: 800

.. image:: ../images/exhibicion/pedidos/Confirmado
   :width: 800

.. image:: ../images/exhibicion/pedidos/Demorado
   :width: 800

.. image:: ../images/exhibicion/pedidos/Fabricando
   :width: 800

.. image:: ../images/exhibicion/pedidos/Finalizado
   :width: 800

.. image:: ../images/exhibicion/pedidos/Entregado
   :width: 800