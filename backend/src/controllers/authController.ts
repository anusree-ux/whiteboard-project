// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Helper function to generate JWT
const generateToken = (id: string) => {
    // NOTE: Add JWT_SECRET to your .env file!
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret', { expiresIn: '30d' });
};

// @route POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id.toString())
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' ,error: error instanceof Error ? error.message : error});
    }
};

// @route POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};