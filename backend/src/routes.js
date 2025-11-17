// importando router do express
import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { authenticateJWT } from "./Middleware/auth.js";
import { getUser, insertUser, deleteUser, updateUser } from "./Controler/User.js";

// instanciando
const router = Router();

router.get('/usuario/auth', authenticateJWT, (req, res) => {
    res.status(200).json({message: 'Usuário autenticado'});
});

router.post('/user', async (req, res) => {
    try {
        const user = await getUser(req.body.email);
        console.log(user)
        res.json(user)
    } catch (err) {
        console.log(err)
    }

})

// Rota de cadastro, insere usuário no bd
router.post('/cadastro', insertUser);

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const userInfo = req.body;

        // buscando o usuário no banco de dados
        const user = await getUser(userInfo.email);
        // verificando se o usuário existe
        if (!user) {
            return res.status(404).json({message:'Usuário não encontrado.'});
        }
        
        // compara a senha enviada com a senha cadastrada
        const passMatch = await bcrypt.compare(userInfo.senha, user.senha);
        if (!passMatch) {
            return res.status(401).json({message: 'Senha inválida.'})
        }
    
        // gerando token JWT
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT});

        res.status(200).json({message:'Login realizado com sucesso.', token:token})
    } catch (err) {
        console.log(err) 
        res.status(500).json({message: 'Ocorreu um erro no processo de login'});
    }
})

// Rota de deletar usuário
router.delete('/deleteaccount', authenticateJWT, deleteUser);

// Rota de atualização de info do usuário
router.put('/atualizar', authenticateJWT, updateUser)

export default router;