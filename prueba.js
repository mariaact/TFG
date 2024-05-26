function validarDatos(nombre, pass, email) {
    let error = false;
    let textoError = "";
    var patronCorreo = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/;
    var patronContrasenna = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var patronNombre = /^[a-z]+$/; 
    
    if (nombre.length === 0) {
      console.log('1')
      textoError += "El nombre está vacío</br>";
    }else if(!patronNombre.test(nombre)) {
      console.log('5')
      textoError += "El nombre de usuario no cumple el patrón</br>";
    }
    if (email.length != 0 && !patronCorreo.test(email)) {
      console.log('2')
      textoError += "El formato de correo es incorrecto</br>";
    }
    if (pass.length === 0) {
      console.log('3')
      textoError += "La contraseña está vacía</br>";
    } else if (!patronContrasenna.test(pass)) {
      console.log('4')
      textoError += "La contraseña no cumple el patrón</br>";
    }
    if (textoError != "") {
      error = true;
    }
    return [error, textoError];
  }

  let [error, textoError] = validarDatos('maria', 'Maria123', 'mariatre@gmail.com');
  console.log(error, textoError);