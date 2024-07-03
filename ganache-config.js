// ganache-config.js
require('dotenv').config();
const { ethers } = require("ethers");

// URL del proveedor Ganache
const ganacheUrl = 'http://127.0.0.1:7545';

// Clave privada de Ganache 
//const privateKey = process.env.GANACHE_KEY
const privateKey = process.env.GANACHE_KEY;

// Configura el proveedor y la cartera
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

// Verificar la conexión
provider.getNetwork().then(network => {
    console.log('Conectado a la red:', network.name);
}).catch(error => {
    console.error('Error al conectar:', error);
});

const wallet = new ethers.Wallet(privateKey, provider);

module.exports = { provider, wallet };

