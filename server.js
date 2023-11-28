const mysql = require('mysql')
const express = require('express')
require('dotenv').config();

console.log(process.env.MYSQL_PASSWORD)

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD

})