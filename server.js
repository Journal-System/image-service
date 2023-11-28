const mysql = require('mysql2')
const express = require('express') //multer + cors
require('dotenv').config();

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'PatientInfo'
})

pool.query("SELECT * FROM user", (error, results, fields) => {
    if (error) {
        console.error('Error executing query:', error.message);
        return;
    }

    console.log('Query results:', results);
});