// importando a conexão com o db
import { openDb } from '../configDB.js';
// importando bcrypt para hashear senhas
import bcrypt from 'bcrypt';

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
            await db.run(`
                INSERT INTO USER (cpf, nome, email, telefone, senha)
                VALUES (?, ?, ?, ?, ?)
            `, [user.cpf, user.nome, user.email, user.telefone, hashedPass]);
    
            res.status(201).json({message:'Usuário cadastrado!'})
        } catch (err) {
            console.log(err);
        }
    }
}