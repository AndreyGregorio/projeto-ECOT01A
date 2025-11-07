// 1. Defina a porta do seu backend Node.js
const PORTA = '3000'; // Ou 3333, 8080, etc. Use a porta que seu servidor está rodando.

/*
 * ESCOLHA UMA DAS OPÇÕES ABAIXO (DESCOMENTE A LINHA CORRETA)
 */

// Opção 1: Se você está usando um EMULADOR ANDROID
//const IP = '10.0.2.2';

// Opção 2: Se você está usando um EMULADOR iOS
// const IP = 'localhost';

// Opção 3: Se você está usando seu CELULAR FÍSICO (Expo Go)
// Você precisa descobrir o IP da sua máquina na rede Wi-Fi.
// (Veja como descobrir abaixo)
const IP = '192.168.15.12'; // <-- Exemplo! Troque pelo seu IP.

// ----------------------------------------------------
// A URL final que será usada no seu app
export const API_URL = `http://${IP}:${PORTA}`;

//DESCOBRIR IP
//CMD
//ipconfig