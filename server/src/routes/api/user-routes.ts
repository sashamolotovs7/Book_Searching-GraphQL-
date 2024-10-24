import express from 'express';
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// import middleware
import { authenticateToken } from '../../services/auth.js';

// Helper function to extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/')
  .post(async (req, res) => {
    try {
      const user = await createUser(req, res);
      res.status(201).json(user);  // Return the created user with status 201
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  })
  .put(authenticateToken, async (req, res) => {
    try {
      const user = await saveBook(req, res);
      res.status(200).json(user);  // Return updated user with status 200
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  });

router.route('/login')
  .post(async (req, res) => {
    try {
      const user = await login(req, res);
      res.status(200).json(user);  // Return the logged-in user
    } catch (error) {
      res.status(401).json({ message: getErrorMessage(error) });  // Return unauthorized if login fails
    }
  });

router.route('/me')
  .get(authenticateToken, async (req, res) => {
    try {
      const user = await getSingleUser(req, res);
      res.status(200).json(user);  // Return the authenticated user's info
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  });

router.route('/books/:bookId')
  .delete(authenticateToken, async (req, res) => {
    try {
      const user = await deleteBook(req, res);
      res.status(200).json(user);  // Return the updated user info after book removal
    } catch (error) {
      res.status(500).json({ message: getErrorMessage(error) });
    }
  });

export default router;
