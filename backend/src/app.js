// imports
import express from 'express';
import router from './routes.js';
import { createTable } from './Controler/User.js';

// instanciando o app
const app = express();

// definindo middlewares
app.use(express.json());
app.use(router);

createTable();

// definindo porta
app.listen(3000);