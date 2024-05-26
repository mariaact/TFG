
let cont = 5;
let final = 9;
let ocultarBotonCargasMas = document.getElementById('load-more1');
let ocultarBotonCargasMas1 = document.getElementById('load-more2');
let ocultarBotonCargasMas2 = document.getElementById('load-more3');


function prueba(data, numero) {

    var peliculas = JSON.parse(data)
    var idCont = 1
    var bloque = '';

    console.log(numero)

    if (numero == 0) {
        bloque = '0';
    } else if (numero == 1) {
        bloque = '1';
    } else if (numero == 2) {
        bloque = '2'
    } else {
        bloque = '3';
    }

    console.log(bloque)

    for (var i = cont; i < final; i++) {

        console.log('https://image.tmdb.org/t/p/original' + peliculas[i].poster_path)
        console.log(peliculas[i].title)
        var idTitulo = 'h3' + bloque + '-' + idCont;
        var idImg = 'img' + bloque + '-' + idCont;
        var idEnlacePelicula = 'enlacePelicula' + bloque + '-' + idCont;
        console.log(idTitulo + '  ******  ' + idImg)

        if(bloque == '0'){
            document.getElementById(idTitulo).innerHTML = peliculas[i].titulo
        document.getElementById(idImg).src = 'https://image.tmdb.org/t/p/original' + peliculas[i].imagen
        document.getElementById(idEnlacePelicula).href = '/peliculaDetallada?valor=' + peliculas[i].title
        }else{
            document.getElementById(idTitulo).innerHTML = peliculas[i].title
        document.getElementById(idImg).src = 'https://image.tmdb.org/t/p/original' + peliculas[i].poster_path
        document.getElementById(idEnlacePelicula).href = '/peliculaDetallada?valor=' + peliculas[i].title
        }

        document.getElementById(idTitulo).innerHTML = peliculas[i].title
        document.getElementById(idImg).src = 'https://image.tmdb.org/t/p/original' + peliculas[i].poster_path
        document.getElementById(idEnlacePelicula).href = '/peliculaDetallada?valor=' + peliculas[i].title

        idCont++;
        if (final > 40) {
            ocultarBotonCargasMas.style.display = 'none';
            ocultarBotonCargasMas1.style.display = 'none';
            ocultarBotonCargasMas2.style.display = 'none';
        }

    }
    cont = cont + 5;
    final = final + 5;


}
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