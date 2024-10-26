// server.ts:
import { ApolloServer } from 'apollo-server-express';
import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import connectDB from './config/connection';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';

// Extend Express Request type to include `user`
declare module 'express' {
  interface Request {
    user?: JwtPayload | string; // Adding the `user` property to the Request type
  }
}

// Load environment variables
dotenv.config();

const app = express() as Application;
const PORT = process.env.PORT || 3001;
const secretKey = process.env.JWT_SECRET || 'fallbackSecretKey';

// Connect to the database
connectDB();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Add allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://book-searching-graphql.onrender.com',
  'https://studio.apollographql.com', // Allow Apollo Studio for development
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return; // Ensure function ends here
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
    return; // Ensure function ends here
  }
};

// Example of a protected route
app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
  if (!req.user) {
    res.status(403).json({ error: 'No user found in request' });
    return;
  }
  res.json({ message: 'This is a protected route', user: req.user });
});

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: Request }) => {
    const token = req.headers.authorization || '';
    if (token.startsWith('Bearer ')) {
      try {
        const formattedToken = token.split(' ')[1];
        const decoded = jwt.verify(formattedToken, secretKey);
        return { user: decoded };
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    return {};
  },
  introspection: process.env.NODE_ENV !== 'production',
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    app.get('/', (_, res) => {
      res.send('<h1>Book App is running. Go to <a href="http://localhost:3000">Frontend</a></h1>');
    });
  }

  app.listen(PORT, () => {
    console.log(`🌍 Book app is running on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
}

startServer();
