const chai = require('chai');
const supertest = require('supertest');
const app = require('./server');

const expect = chai.expect;
const request = supertest(app);
const mockFs = require('mock-fs');

describe('POST /upload', () => {
    it('should upload an image successfully', (done) => {
        request.post('/upload')
            .attach('image', 'images/imageForPostman.png')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal('Image uploaded successfully');
                done();
            });
    });
});

describe('POST /save/:imageId', () => {
    it('should update an image successfully', (done) => {
        const imageIdToUpdate = 1;
        request.post(`/save/${imageIdToUpdate}`)
            .attach('image', 'images/imageForPostman.png')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).to.equal('Image updated successfully');
                done();
            });
    });

    it('should handle missing file during update', (done) => {
        const imageIdToUpdate = 2;
        request.post(`/save/${imageIdToUpdate}`)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).to.equal('no file uploaded');
                done();
            });
    });
});

describe('GET /download/:imageId', () => {
    it('should download an existing image successfully', (done) => {
        const existingImageId = 1;

        request.get(`/download/${existingImageId}`)
            .expect(200)
            .expect('Content-Type', 'image/png') // Content type
            .end((err, res) => {
                if (err) return done(err);

                done();
            });
    });

    it('should handle a non-existing image', (done) => {
        const nonExistingImageId = 999; // Id that hopefully dont exist, otherwise do -1 for test in database

        request.get(`/download/${nonExistingImageId}`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);

                done();
            });
    });
});