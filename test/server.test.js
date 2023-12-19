const request = require('supertest');
const express = require('express');
const server = require('../server'); // Assuming your server file is named server.js

// Mock MySQL
jest.mock('mysql2', () => ({
    createPool: jest.fn(() => ({
      query: jest.fn(),
    })),
  }));
  const mysql = require('mysql2');
  
  

// Mock Multer
jest.mock('multer', () => {
  const singleMock = jest.fn(() => (req, res, next) => {
    req.body = { userName: 'testUser' };
    req.file = {
      originalname: 'sample.name',
      encoding: 'sample.encoding',
      mimetype: 'sample.type',
      destination: 'sample.destination',
      filename: 'sample.filename',
      path: 'sample.url',
      size: 123, // or any other size you want to mock
      buffer: Buffer.from('whatever'),
    };
    return next();
  });

  const multerMock = jest.fn(() => ({
    single: singleMock,
    // Add other methods if needed
  }));

  multerMock.memoryStorage = jest.fn();

  return multerMock;
});

//   describe('POST /upload', () => {
//     it('should upload an image successfully', async () => {
//       // Mock Multer's memoryStorage
//       const memoryStorageMock = jest.fn();
//       multerMock.memoryStorage.mockImplementation(memoryStorageMock);
  
//       // Mock MySQL createPool
//       const queryMock = jest.fn();
//       mysql.createPool.mockReturnValue({ query: queryMock });
  
//       const response = await request(server)
//         .post('/upload')
//         .attach('image', 'path/to/your/test/image.jpg');
  
//       expect(response.status).toBe(200);
//       expect(response.text).toBe('Image uploaded successfully');
//       // Add more assertions if needed
//     });
//   });

// describe('POST /save/:imageId', () => {
//   // Write test cases for the /save/:imageId endpoint
// });

// describe('GET /download/:imageId', () => {
//   // Write test cases for the /download/:imageId endpoint
// });

describe('GET /healthz', () => {
    it('should return status OK', async () => {
      const response = await request(server).get('/healthz'); // Use app, not server
  
      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
    });
  });
