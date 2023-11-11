const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { registerUser, loginUser,getUser } = require('./controllers/userController')
const jwt = require('jsonwebtoken');

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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})
app.get('/user', authenticateToken, getUser);