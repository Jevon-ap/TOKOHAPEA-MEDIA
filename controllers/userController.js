const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
 
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            'rahasia', 
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User berhasil dibuat', user: newUser })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'rahasia', 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login berhasil', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function getUser(req, res) {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}