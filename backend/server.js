const express = require('express');
const path = require('path');
const fs = require('fs');
const {Client} = require('pg');
require('dotenv').config({
    path: path.join(path.dirname(__dirname), 'development.env')
});

const app = express();

const client = new Client({
    connectionString: process.env.DATABASE_URL_BIOLOGY
});

async function createTable() {
    console.log(path.join(path.dirname(__dirname), 'development.env'));
    try {

        await client.connect();

        const sqlFilePath = path.join(path.dirname(__dirname), 'database/schema.sql');
        const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

        await client.query(sqlQuery);
        console.log('Created table.');
        await client.end();
    } catch (error) {
        console.log('Error creating table.', error);
        await client.end();
    }
}

createTable();

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})