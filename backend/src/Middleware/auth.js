import jwt from 'jsonwebtoken';
import 'dotenv/config';

// função de autenticação do token para processos que requerem que o usuário esteja logado
export function authenticateJWT (req, res, next) {
    // recebendo o token do campo 'authorization' do header da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // caso não tenha o token
    if (!token) {
        return res.status(401).json({message: 'Acesso negado'});
    }

    // verifica o token, se válido, envia as informações dele decodificadas para a requisição e segue com o processo
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.authUser = decoded;
        next();
    } catch (err) {
        // caso token inválido
        res.status(403).json({message: 'Token inválido ou expirado'})
    }
}