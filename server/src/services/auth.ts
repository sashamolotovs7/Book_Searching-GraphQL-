import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecret';

// Extend the Request interface to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload | string; // Add `string` to handle all possible decoded types (e.g., string tokens)
  }
}

/**
 * Middleware to authenticate JWT tokens.
 * Ensures the incoming request has a valid JWT token and attaches the decoded payload to `req.user`.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Retrieve the token from the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token if it exists

  if (!token) {
    // If no token is provided in the request header, return a 401 (Unauthorized) error
    res.status(401).json({ error: 'No token provided' });
    return; // Stop further processing
  }

  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, decodedUser) => {
    if (err) {
      // If the token is invalid or expired, return a 403 (Forbidden) error
      console.error('Token verification failed:', err.message);
      res.status(403).json({ error: 'Invalid or expired token' });
      return; // Stop further processing
    }

    // If token is valid, attach the user information to the `req` object
    if (typeof decodedUser !== 'string') {
      req.user = decodedUser as JwtPayload;
    }

    next(); // Call the next middleware or route handler
  });
};

/**
 * Example of a function to generate a token for users
 * This will be useful to add in the same file to help issue JWT tokens upon successful login/signup.
 */
export const generateToken = (user: { id: string; email: string }): string => {
  return jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: '2h', // Token is valid for 2 hours
  });
};
