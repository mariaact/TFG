# **Aplicación Web Cinepolis**

## Aplicación Web Cinepolis
El presente Trabajo Final de Grado se centra en el desarrollo de un sistema de recomendaciones de películas dirigido a entusiastas de la cinematografía, utilizando técnicas de procesamiento de lenguaje natural. Los usuarios podrán acceder a una página web donde se representarán las películas de dos modos: un catálogo general y secciones organizadas por géneros y rankings, recomendando películas según los gustos del usuario. Las valoraciones de los usuarios servirán para entrenar los motores de recomendaciones, incentivando las valoraciones mediante un sistema basado en blockchain. El desarrollo frontend emplea HTML, CSS y JavaScript, mientras que el backend utiliza Node.js y Express.

## Requisitos para su ejecución
Es necesario tener instaladas las herramientas de `Node.js`,  el entorno de desarrollo Ethereum  `Ganache`, una shell para ejecutar el entorno, y por último, un navegador para acceder a la aplicación (se recomienda Chrome).

## Preparación del entorno y despliegue
### Instalación de Node.js
Descargue e instale la versión LTS más actualizada de Node.js del siguiente link: https://nodejs.org/en/

Compruebe que lo ha instalado correctamente, en la shell escriba:
~~~
>node --version
~~~
Y debería haber obtenido una versión igual o superior a la siguiente salida por consola:
~~~
v18.14.0
~~~

### Instalación y configuración de Ganache
Diríjase a la web oficial de descarga de Ganache y descargue e instale el ejecutable de instalación de Ganache: [https://archive.trufflesuite.com/ganache/].
Para poder trabajar con Ganache debes crearte un nuevo espacio de trabajo.

Dentro del nuevo espacio de trabajo, se debe obtener la clave privada de una de las carteras que se muestran por pantalla, mediante el símbolo de la llave. 
![plot](public/images/ganache.png)

## Modo de Empleo
Para ejecutar el programa, inicie la aplicación de Ganache, esta herramienta simula una red blockchain local para propósitos de desarrollo. 
Seguidamente abra una shell, y dentro de la raíz del proyecto, ejecute para instalar las dependencias:
~~~
>npm install
~~~

A continuación, inicie la aplicación:
~~~
>npm start
~~~

Por último, acceda al navegador, y conéctese al puerto por donde escucha la aplicación por defecto: 10000/tcp
~~~
En la barra del navegador: localhost:10000
~~~

En este momento, puede disfrutar de la aplicación navegando por las distintas secciones.
