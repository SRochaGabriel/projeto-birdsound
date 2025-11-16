// importando router do express
import { Router } from "express";
import { insertUser } from "./Controler/User.js";

// instanciando
const router = Router();

// Definindo rotas
router.get('/', (req, res) => {
    res.json({message:'API rodando'})
})
router.post('/cadastro', insertUser);
export default router;