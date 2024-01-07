const mysql = require('mysql2')
const multer = require('multer')
const express = require('express')
const cors = require('cors')
require('dotenv').config();

const keycloak = require('./config/keycloak-config.js').initKeycloak();


const app = express()
const port = 8084

app.use(keycloak.middleware());

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5, //max 5mb file, 1kb * 1kb = 1mb and then * 5 for 5mb base is bytes used in multer
    },
})

const pool = mysql.createPool({
    host: 'vm.cloud.cbh.kth.se', 
    port: 2776,
    user: "root",
    password: "PASSWORD123",
    database: 'PatientInfo'
})

pool.query(`
    CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data LONGBLOB
    )
`, (error, results, fields) => {
    if (error) {
        console.error('Error creating "images" table:', error.message);
        return;
    }
    console.log('Table "images" created or already exists');
});

app.use(express.json())

const corsOptions = {
    origin: '*', // Allow all origins
    credentials: true, // Enable credentials
    methods: 'GET,POST,PUT,OPTIONS', // Explicitly specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly specify allowed headers
  };
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
  


app.post('/upload', keycloak.protect('DOCTOR'), upload.single('image'), (req, res) => {
    const imageData = req.file.buffer; // The image data in a Buffer

    // Save the image data to the database
    pool.query('INSERT INTO images (data) VALUES (?)', [imageData], (error, results, fields) => {
        if (error) {
            console.error('Error saving image:', error.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).send('Image uploaded successfully');
    });
});

app.post('/save/:imageId', keycloak.protect('DOCTOR'), upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).send('no file uploaded')
    }
    const imageId = req.params.imageId;
    const imageData = req.file.buffer;

    // Update the image data in the database based on the imageId
    pool.query('UPDATE images SET data = ? WHERE id = ?', [imageData, imageId], (error, results, fields) => {
        if (error) {
            console.error('Error updating image:', error.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).send('Image updated successfully');
    });
});

app.get('/download/:imageId', keycloak.protect('DOCTOR'), (req, res) => {
    const imageId = req.params.imageId;

    // Retrieve image data from the database based on the imageId
    pool.query('SELECT data FROM images WHERE id = ?', [imageId], (error, results, fields) => {
        if (error) {
            console.error('Error retrieving image:', error.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Image not found');
            return;
        }

        const imageData = results[0].data;

        // Set the appropriate headers for image response
        res.setHeader('Content-Type', 'image/png'); // Change content type based on your image type
        res.send(imageData);
    });
});

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
    console.log(`Health check endpoint: ${port}/healthz`);
});

module.exports = app; 