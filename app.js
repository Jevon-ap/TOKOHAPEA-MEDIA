const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { registerUser, loginUser,getUser } = require('./controllers/userController')
const jwt = require('jsonwebtoken');
const upload = require('./libs/multer').image;
const { storageImage } = require('./controllers/mediaController');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).send('Akses ditolak');

    jwt.verify(token, 'rahasia', (err, user) => {
        if (err) return res.status(403).send('Token tidak valid');
        req.user = user;
        next();
    });
}

app.use(express.json())

app.post('/register', registerUser)
app.post('/login', loginUser)
app.post('/upload-profile-picture', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No image file provided");
        }
        console.log(req.file); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})
app.get('/user', authenticateToken, getUser);