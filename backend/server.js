const express = require('express');
const path = require('path');
const cors = require('cors');
const {Client, Pool} = require('pg');
const format = require('pg-format');

require('dotenv').config({
    path: path.join(path.dirname(__dirname), 'development.env')
});

const app = express();

app.use(cors());
app.use(express.json());

const clientConfig = {connectionString: process.env.DATABASE_URL_FLASHCARDS};
const poolConfig = {connectionString: process.env.DATABASE_URL_FLASHCARDS};

const pool = new Pool(poolConfig);

function correctTableName(tableName) {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(tableName);
}

async function addNewTable(tableName) {

    if (!correctTableName(tableName)) {
        console.log('Incorrect table name.');
        return;
    }

    const sqlQuery = format(`
    CREATE TABLE IF NOT EXISTS %I (
        id SERIAL PRIMARY KEY,
        question VARCHAR(200),
        answer VARCHAR(200)
    );
    `, tableName);

    const client = new Client(clientConfig);
    try {
        await client.connect();
        await client.query(sqlQuery);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

async function insertDatabase() {
    const query = `INSERT INTO "Biology" (question, answer) VALUES ('What is the captial of France?', 'Paris'), ('Who wrote Hamlet?', 'William Shakespeare'), ('What is 2 + 2?', '4');`
    const client = new Client(clientConfig);
    try {
        await client.connect();
        await client.query(query);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

app.get('/api/tables', async (req, res) => {
    const client = new Client(clientConfig);
    try {
        client.connect();
        const sqlQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema='public';";
        const result = await client.query(sqlQuery);
        const tableNames = result.rows.map(row => row.table_name);
        res.json(tableNames);
    } catch (err) {
        console.error('Error with query.', err);
        res.status(500).json({error: 'Internal Server Error'});
    } finally {
        client.end();
    }
});

app.post('/api/cards', async (req, res) => {
    const client = new Client(clientConfig);
    
    try {
        await client.connect();
        const { tableName } = req.body;
        console.log(tableName);

        const query = `SELECT question, answer FROM "${tableName}" ORDER BY id`;
        const result = await client.query(query);
        console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching questions.', err);
        res.status(500).json({ error: 'Error fetching questions from database' });
    } finally {
        await client.end();
    }
});

app.post('/api/create_table', async (req, res) => {
    const { tableName, data } = req.body;

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        addNewTable(tableName);

        const sqlQuery = format(`
            INSERT INTO %I (Questions, Answers) VALUES (%1, %2);
            `, tableName);

        for (const row of data) {
            const values = [row.Questions, row.Answers];
            await client.query(sqlQuery, values);
        }

        await client.query('COMMIT');
        res.status(200);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error fetching questions.', err);
        res.status(500).json({ error: 'Error fetching questions from database' });
    } finally {
        client.release();
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})