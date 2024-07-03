let corazon = false;

function toggleHeart(button, pelicula, user, perfil) {

  button.querySelector('.heart-icon').classList.toggle('active');
  var heartIcon = button.querySelector('.heart-icon');

  if (heartIcon.classList.contains('active')) {
    corazon = true;
    const dataToSend = { 'Pelicula': pelicula, 'Usuario': user, 'Corazon': corazon, 'Perfil': perfil}
  fetch('http://localhost:3000/enviar-datos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error al enviar datos al servidor:', error);
    });

  } else {
    corazon = false;
    const dataToSend = {'Pelicula': pelicula, 'Usuario': user, 'Corazon': corazon,'Perfil': perfil }

  fetch('http://localhost:3000/enviar-datos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error al enviar datos al servidor:', error);
    });
  }
}



