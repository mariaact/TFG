// ganache-config.js
require('dotenv').config();

const { ethers } = require("ethers");

// URL del proveedor Ganache
const ganacheUrl = 'http://127.0.0.1:7545';

// Clave privada de Ganache 
//const privateKey = process.env.GANACHE_KEY
const privateKey = "0xa3a85edbf12ed2334ee8b69cce9e818f9205fa3363f899bee374a96745765cc5";

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

