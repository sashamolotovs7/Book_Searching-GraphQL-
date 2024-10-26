import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: { bookId: string; title: string }[];
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  savedBooks: [
    {
      bookId: { type: String },
      title: { type: String },
    },
  ],
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = model<UserDocument>('User', userSchema);
export default User;
export type { UserDocument }; // Add this export to use elsewhere
