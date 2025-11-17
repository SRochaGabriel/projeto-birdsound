// imports
import express from 'express';
import router from './routes.js';
import cors from 'cors';
import { createTable } from './Controler/User.js';

const corsOptions = { origin: 'http://localhost:5500' }

// instanciando o app
const app = express();

// definindo middlewares
app.use(express.json());
app.use(cors(corsOptions))
app.use(router);

createTable();

// definindo porta
app.listen(8000);