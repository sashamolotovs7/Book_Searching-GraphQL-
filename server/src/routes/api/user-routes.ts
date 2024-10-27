import { Request, Response } from 'express';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'defaultSecret';

// Extend Express Request type to include `user` that is consistent with server.ts
declare module 'express' {
  export interface Request {
    user?: JwtPayload | string;
  }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as { username: string; email: string; password: string };

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token for the new user
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, secretKey, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token for the logged-in user
    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};
