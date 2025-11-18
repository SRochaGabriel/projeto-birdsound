// Importações
import 'dotenv/config';
import { openDb } from '../configDB.js';
import { resetPassword } from './User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import transporter from '../configMail.js';

// Função que envia o código de recuperação de senha para o usuário
export async function sendCode (req, res) {
    const db = await openDb();

    try {
        const email = req.body.email;

        // Verificando se há um usuário com esse email cadastrado, caso tenha, envia o código de recuperação. Caso contrário, não tenta enviar
        const user = await db.get('SELECT id FROM User WHERE email=?', email);
        if (user) {
            // gerando número aleatório de 6 digitos
            const codigo = String(crypto.randomInt(100000, 1000000));
            
            // envia email de recuperação
            await transporter.sendMail({
                from: `Futura Soluções <${process.env.MAIL_USER}>`,
                to: `${email}`,
                subject: 'Código para recuperação de senha',
                html: `<h2>Olá, aqui está seu código para recuperação de senha!</h2> <p>Recebemos uma soliticação de recuperação de senha para sua conta no site Bird Sound, utilize esse código para poder alterar sua senha (ele será válido por 15 minutos):</p> <h1>${codigo}</h1>`,
                text: `Olá, aqui está seu código para recuperação de senha: ${codigo}`
            });

            const salt = await bcrypt.genSalt();
            const hashedCode = await bcrypt.hash(codigo, salt);

            // gera token com codigo e id do user
            const token = jwt.sign({codigo: hashedCode, id: user.id}, process.env.JWT_SECRET, {expiresIn: '15m'});

            res.status(200).json({message: 'E-mail enviado.', token:token});
        } else {
            res.status(500).json({message: 'Ocorreu um erro durante a tentativa de envio do e-mail.'});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Ocorreu um erro durante a tentativa de envio do e-mail.'});
    }
}

// função que recebe o codigo que o usuario digitou + senha e o token
// compara o codigo digitado com o código correto, se for igual, troca a senha
export async function getCode(req, res) {
    // codigo encriptado e id que vêm do token
    const codigoCerto = req.userA.codigo;
    const id = req.userA.id;
    // senha e codigo digitados pelo usuario
    const senha = req.body.senha;
    const codigoDigitado = req.body.codigo;

    const codeMatch = await bcrypt.compare(codigoDigitado, codigoCerto);
    if (!codeMatch) {
        return res.status(401).json({message: 'Código digitado é inválido'});
    }

    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(senha, salt);
    // caso o código digitado seja válido
    try {
        resetPassword(hashedPass, id);
        res.status(200).json({message: 'Senha alterada com sucesso!'});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Ocorreu um erro durante a tentativa de redefinir sua senha.'});
    }
}