const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Adjust the path if necessary

router.post('/auth/signup', async (req, res) => {
    const { User_name, User_email, password } = req.body;

    if (!User_name || !User_email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if the user with this email already exists
        const [existingUser] = await db.promise().query('SELECT * FROM user WHERE User_email = ?', [User_email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await db.promise().query(
            'INSERT INTO user (User_name, User_email, password) VALUES (?, ?, ?)',
            [User_name, User_email, hashedPassword]
        );

        const userId = result.insertId;

        // Generate a JWT token
        const token = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' }); // Replace 'your-secret-key' with a strong, secret key

        res.status(201).json({ message: 'User created successfully', token });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Failed to signup.' });
    }
});


router.post('/auth/login', async (req, res) => {
    const { User_email, password } = req.body;

    if (!User_email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    try {
        // Find the user by email
        const [users] = await db.promise().query('SELECT * FROM user WHERE User_email = ?', [User_email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.User_id }, 'your-secret-key', { expiresIn: '1h' }); // Use the same secret key as in signup

        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Failed to login.' });
    }
});


module.exports = router;