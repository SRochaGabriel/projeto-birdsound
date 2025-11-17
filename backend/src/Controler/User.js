// importando a conexão com o db
import { openDb } from '../configDB.js';
// importando bcrypt para hashear senhas
import bcrypt from 'bcrypt';
import e from 'express';
import jwt from 'jsonwebtoken';

// função de criação de tabela
export async function createTable() {
    const db = await openDb();

    db.exec(`
            CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY,
                cpf VARCHAR(14) NOT NULL,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                telefone VARCHAR(15),
                senha varchar(60) NOT NULL
            )
        `);
}

// função de retorno de um usuário
export async function getUser(email) {
    const db = await openDb();

    return await db.get('SELECT * FROM User WHERE email=?', email);
}

// função de inserção de usuário
export async function insertUser(req, res) {
    if (!req.body) {
        return res.status(400).json({message:'Dados para cadastro não encontrados.'});
    } else {
        const user = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(user.senha, salt);

        const db = await openDb();
    
        try {
            const newUser = await db.run(`
                INSERT INTO User (cpf, nome, email, telefone, senha)
                VALUES (?, ?, ?, ?, ?)
            `, [user.cpf, user.nome, user.email, user.telefone, hashedPass]);

            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT});
    
            res.status(201).json({message:'Usuário cadastrado!', token:token})
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({message:'E-mail já cadastrado.'})
            }

            res.status(500).json({message:'Ocorreu um erro durante o processo de cadastro.'})
        }
    }
}

// função de apagar conta do usuário
export async function deleteUser(req, res) {
    const userId = req.authUser.id;
    const db = await openDb();

    try {
        await db.run('DELETE FROM User WHERE id=?', userId);

        res.status(200).json({message:'Usuário apagado.'});
    } catch {
        res.status(500).json({message:'Não foi possível excluir o usuário.'});
    }
}

// atualizar informações do usuário
export async function updateUser(req, res) {
    if (!req.body) {
        return res.status(400).json({message:'Dados para atualização não encontrados.'});
    } else {
        const user = req.body;
        const userId = req.authUser.id;

        const db = await openDb();
    
        try {
            await db.run(`
                UPDATE User
                SET cpf = ?,
                    nome = ?,
                    email = ?,
                    telefone = ?
                WHERE id = ?
            `, [user.cpf, user.nome, user.email, user.telefone, userId]);
    
            res.status(201).json({message:'Cadastro atualizado!'})
        } catch (err) {
            res.status(500).json({message:'Ocorreu um erro durante a tentativa de atualização das informações.'})
        }
    }
}