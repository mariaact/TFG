// Biblioteca de análisis de sentimientos en español
const natural = require('natural');
const tokenizer = new natural.SentenceTokenizer();
var database = require('./consultasDB');

function obtenerPuntaje(valoracion) {
    switch (valoracion) {
        case 'excelente':
            return 5;
        case 'buena':
            return 4;
        case 'regular':
            return 3;
        case 'mala':
            return 2;
        default:
            return 1; // Valoración no especificada o incorrecta
    }
}

function obtenerPuntajeComentario(sentimiento) {
    switch (sentimiento) {
        case 'positivo':
            return 3;
        case 'neutral':
            return 2;
        case 'negativo':
            return 1;
        default:
            return 1; // Sentimiento no especificado o incorrecto
    }
}

// Función para analizar el sentimiento de un comentario
function analizarSentimientos(comentario) {
    // Verificar si el comentario está definido y no es nulo
    if (comentario && typeof comentario === 'string') {
        // Realizar el análisis de sentimientos
        if (comentario.includes('genial') || comentario.includes('excelente')) {
            return 'positivo';
        } else if (comentario.includes('regular') || comentario.includes('normal')) {
            return 'neutral';
        } else {
            return 'negativo';
        }
    } else {
        return 'desconocido'; // Manejar el caso en el que el comentario no esté definido
    }
}

// Función para calcular la similitud entre el perfil de un usuario y una película
function calcularSimilitud(usuario, pelicula, perfil) {
    const valoracionUsuario = perfil[usuario].find(item => item.pelicula === pelicula.titulo);
    if (!valoracionUsuario) {
        return 0; // No hay valoración del usuario para esta película
    }

    // Calcular la similitud entre la valoración del usuario y la película
    const puntajeValoracion = obtenerPuntaje(valoracionUsuario.valoracion);
    const similitud = Math.abs(puntajeValoracion - obtenerPuntaje(pelicula.valoracion)) +
        Math.abs(puntajeValoracion - obtenerPuntajeComentario(analizarSentimientos(valoracionUsuario.comentario)));
    return similitud;
}

// Función para recomendar películas según los gustos del usuario
function recomendarPeliculasSegunGustos(usuario, perfilUsuario, catalogoPeliculas) {
    const perfil = perfilUsuario.perfil; // Perfil del usuario

    // Calcular la similitud entre el perfil del usuario y cada película en el catálogo
    const peliculasConSimilitud = catalogoPeliculas.map(pelicula => {
        const similitud = calcularSimilitud(usuario, pelicula, perfil);
        return { pelicula, similitud };
    });

    // Ordenar las películas por similitud de menor a mayor
    peliculasConSimilitud.sort((a, b) => a.similitud - b.similitud);

    // Devolver las N películas más similares
    return peliculasConSimilitud.slice(0, 50).map(item => item.pelicula);
}

async function principal(nombrePerfil) {
    const catalogoPeliculas = await database.ObtenerTituloGeneroDescripcionDeTodasPeliculas();
    const perfilUsuario = await database.analisisSentimiento(nombrePerfil);
    const recomendaciones = recomendarPeliculasSegunGustos(nombrePerfil, perfilUsuario, catalogoPeliculas);
    // console.log('Recomendaciones de películas para', nombrePerfil + ':', recomendaciones);
    return recomendaciones;
}

module.exports = { principal };
