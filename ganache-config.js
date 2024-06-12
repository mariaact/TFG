// ganache-config.js
const { ethers } = require("ethers");

// URL del proveedor Ganache
const ganacheUrl = 'http://127.0.0.1:7545';

// Clave privada de Ganache (ejemplo)
const privateKey = '0xc0d7445cddaa141832a191ed76e421c785c48d5546c7576299a632573f76f2b0';

console.log('-------------------------------------------------------------------')
// Configura el proveedor y la cartera
const provider = new ethers.providers.JsonRpcProvider(ganacheUrl);

// Verificar la conexión
provider.getNetwork().then(network => {
    console.log('Conectado a la red:', network.name);
}).catch(error => {
    console.error('Error al conectar:', error);
});


const wallet = new ethers.Wallet(privateKey, provider);





module.exports = { provider, wallet };

