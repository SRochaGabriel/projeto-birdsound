// importando o sqlite3 e a função open do 'sqlite'
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// exportando função de abertura/conexão do banco
export async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.cached.Database
    });
}