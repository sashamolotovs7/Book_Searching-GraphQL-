import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    // Query to get the logged-in user's information
    me: async (_parent: any, _args: any, context: any) => {
      console.log('Context User:', context.user); // Log to verify if context.user exists
      if (context.user) {
        // Find and return the user based on their _id
        const user = await User.findById(context.user._id);
        console.log('User data retrieved:', user); // Debugging log
        return user;
      }
      // If no user is found in the context, throw an authentication error
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // Mutation to log in a user
    login: async (_parent: any, { email, password }: { email: string, password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValid = await user.isCorrectPassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Mutation to add a new user (signup)
    addUser: async (_parent: any, { username, email, password }: { username: string, email: string, password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Mutation to save a book to the user's account
    saveBook: async (_parent: any, { input }: { input: any }, context: any) => {
      console.log('Saving book input:', input); // Debug log
      if (context.user) {
        // Add the book to the user's savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } }, // Use $addToSet to avoid duplicates
          { new: true }
        );
        console.log('Updated user after saving book:', updatedUser); // Debugging log
        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },

    // Mutation to remove a book from the user's account
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      console.log('Removing book ID:', bookId); // Debug log
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } }, // Use $pull to remove the specific book
          { new: true }
        );
        console.log('Updated user after removing book:', updatedUser); // Debugging log
        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

export default resolvers;
