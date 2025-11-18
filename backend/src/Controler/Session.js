// importando a conexão com o db
import { openDb } from '../configDB.js';
// importando bcrypt para hashear senhas
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// função de login
export async function logUser(req, res) {
    const db = await openDb();

    try {
        const userInfo = req.body;

        // buscando usuário no bd
        const user = await db.get('SELECT id, email, senha FROM User WHERE email=?', userInfo.email);

        // verifica se usuário existe
        if (!user) {
            return res.status(401).json({message: 'E-mail ou senha inválido.'});
        }

        // compara a senha enviada com a senha cadastrada
        const passMatch = await bcrypt.compare(userInfo.senha, user.senha);
        if (!passMatch) {
            return res.status(401).json({message: 'E-mail ou senha inválido.'});
        }

        // gerando token jwt
        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT});

        // resposta
        res.status(200).json({message: 'Login realizado com sucesso!', token:token});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Ocorreu um erro no processo de login'});
    }
}

// função que simplesmente retorna 200 caso o token do usuário ainda seja válido, ou seja, autentica ele
export async function authUser(req, res) {
    res.status(200).json({message: 'Usuário autenticado'});
}