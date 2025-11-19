// importando router do express
import 'dotenv/config';
import { Router } from "express";
import { authenticateJWT } from "./Middleware/auth.js";
import { getUser, insertUser, deleteUser, updateUser } from "./Controler/User.js";
import { logUser, authUser } from './Controler/Session.js';
import { getCode, sendCode } from './Controler/Recovery.js';
import { getProdutos } from './Controler/Produto.js';

// instanciando
const router = Router();

// ======================== ROTAS DE USUARIO =================================
// Rota que busca as informações do usuário para exibir no perfil
router.get('/user', authenticateJWT, getUser);

// Rota de cadastro, insere usuário no bd
router.post('/cadastro', insertUser);

// Rota de deletar usuário
router.delete('/deleteaccount', authenticateJWT, deleteUser);

// Rota de atualização de info do usuário
router.put('/atualizar', authenticateJWT, updateUser);

// ======================== ROTAS DE SESSÃO ==================================
// Rota de autenticação, serve para verificar se o usuário está logado
router.get('/usuario/auth', authenticateJWT, authUser);

// Rota de login
router.post('/login', logUser);

// ======================= ROTAS DE RECUPERAÇÃO DE SENHA ===========================
// Rota que envia um e-mail com informações para recuperação de senha
router.post('/sendcode', sendCode);

// Rota que realiza a validação e atualização de senha
router.put('/resetpass', authenticateJWT, getCode);

// ======================== ROTAS DE PRODUTOS ==================================
router.get('/produtos/:page', getProdutos);

export default router;