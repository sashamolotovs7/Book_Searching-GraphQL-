import express, { Application, RequestHandler } from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import db from './config/connection.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

dotenv.config(); // Load environment variables

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Explicitly typecast the limiter to `RequestHandler` to resolve type mismatch
app.use(limiter as unknown as RequestHandler);

// CORS Configuration
app.use(
  cors({
    origin: [
      // 'http://localhost:3000', // Your frontend during local development
      // 'https://studio.apollographql.com', // Apollo Studio
      'https://your-frontend-app.onrender.com', // Updated with your frontend Render URL
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    console.log(`Request received: ${req.method} ${req.url}, Token: ${token}`); // Log request details and token

    // Ignore health check requests from Apollo Studio or specific URLs
    if (req.headers['user-agent']?.includes('Apollo') || req.url === '/graphql/health') {
      return {};
    }

    if (token.startsWith('Bearer ')) {
      const formattedToken = token.split(' ')[1];
      const secretKey = process.env.JWT_SECRET_KEY;

      if (!secretKey) {
        throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
      }

      try {
        const decoded = jwt.verify(formattedToken, secretKey);
        console.log('Decoded Token:', decoded);
        return { user: decoded };
      } catch (err) {
        if (err instanceof Error) {
          console.error('Invalid token:', err.message);
        } else {
          console.error('Unknown error occurred during token verification.');
        }
      }
    }
    return {};
  },
  introspection: process.env.NODE_ENV !== 'production', // Enable introspection only in development
});

// Start Apollo server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Serve client from dist folder when in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    // Development - serve a message to indicate the app is running
    app.get('/', (_, res) => {
      res.send('<h1>Book App is running. Go to <a href="http://localhost:3000">Frontend</a></h1>');
    });
  }

  // Start listening on the specified port
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Book app is running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
