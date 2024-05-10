

//const db = require('./consultasDB.js'); 


async function prueba() {

    /*const imagenes = await db.peliculasMasVistas();
    for (var i = 5; i < 10; i++){
    }
    console.log('¡Se presionó el botón "Cargar más"!');*/

}

prueba();
/*const { peliculasMasVistas } = require('./consultasDB'); // Importa el archivo desde la raíz
const botonCargarMas = document.getElementById('load-more-1');
console.log('estoy en el scrippppttt')
// Agregar un evento de clic al botón
botonCargarMas.addEventListener('click', function() {
  // Imprimir un mensaje en la consola cuando se hace clic en el botón
  console.log('¡Se presionó el botón "Cargar más"!');
});


//import { peliculasMasVistas } from './consultasDB';

//let botonCargarMas = document.querySelector('#load-more-1');
//let botonCargarMas2 = document.querySelector('#load-more-2');
//let botonCargarMas3 = document.querySelector('#load-more-3');


//const imagenes1 = await database.obtenerInfoPeliculasGenero('Aventura');
//const imagenes2 = await database.obtenerInfoPeliculasGenero('Comedia');

document.getElementById('load-more-2').addEventListener('click', async function() {

    console.log('ESTOY EN EL BOTON DE CARGAR MAS EN EL PRIMER BOTOOOON');
    const imagenes = await peliculasMasVistas();
    var imagenElementos = document.querySelectorAll('.box-container-1 .content img')
    console.log(imagenElementos);
    for (var i = 5; i < imagenElementos.length; i++){
     imagenElementos[i].src = imagenes[i]
     console.log('-----**** ' + imagenes[i]);
    }
    console.log('¡Se presionó el botón "Cargar más"!');

});

/*botonCargarMas2.onclick = () => {

   var imagenElementos = document.querySelectorAll('.box-container-1 .content img')
   for (var i = 5; i < imagenElementos.length; i++){
    imagenElementos[i].src = imagenes1[i]
   }
}

botonCargarMas3.onclick = () => {

    var imagenElementos = document.querySelectorAll('.box-container-2 .content img')
    for (var i = 5; i < imagenElementos.length; i++){
     imagenElementos[i].src = imagenes2[i]
    }
 }*/