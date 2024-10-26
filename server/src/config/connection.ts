import mongoose from 'mongoose';

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      // You no longer need to specify `useNewUrlParser` and `useUnifiedTopology` as they are now defaults
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
