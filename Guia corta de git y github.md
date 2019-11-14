# Git y GitLab

## Que es cada uno y en que se diferencias

### Git

Git es un gestor de versiones que se instala *localmente* y te sirve para llevar a cabo el versionado de tu codigo localmente para poder realizar cambios en el proyecto (mef), con la posibilidad de ir avanzando y dejando "puntos de guardado" para luego poder romper tu codigo tranquilo.

### GitLab

GitLab es una *pagina web* para administrar repositorios de codigo para equipos colaborativos y distribuidos. Esto permite que trabajemos simultaneamente inclusive en los mismos archivos sin morir en el intento. Esto nos permite llevar a cabo un codigo fuente mas limpio, aislando el codigo que este lleno de bug y nos rompa todo el proyecto (RIP).

## Que tengo que aprender primero

Primero tenes que aprender que git es un programa. Por lo tanto en entorno de windows tenes que bajarte git (excepto si tenes linux). [Link](https://git-scm.com/downloads)

Luego de tener instalado git, se usa de la siguiente manera

    Los comandos de git no funcionan en una carpeta que no este inicializada como carpeta de git (exceptuando git clone)

## Y ahora que

Ahora que ya tenes instalado git, tenes que decir que esa carpeta va a ser tratada como una carpeta que va a utilizar git para control de versiones

## 1.-Iniciar una carpeta con git

    git init

## 2.-Ahora que esta clonamos el repositorio del mef

    git clone https://gitlab.com/unpsjb/mef-team/mef.git

## 3.-Moverse a el directorio de mef

    cd mef

## 4.-Crear una y moverse a una rama

    git checkout -b nombreRama

## 5.-Una vez que hicimos cambios sobre la rama

    git add .

## 6.-Confirmamos los cambios que hicimos sobre la rama

    git commit -m "mensaje significativo"

## 7.-Enviar una rama a gitlab

    git push origin nombreRama 

## 8.-Cuando queremos trabajar sobre otra HU

    Volver a empezar desde 4.-

## Algunas reglas

* no pushear a master
* nombre de la rama respecto a la HU
* commit descriptivos
* usar prefijos como fix, feature
