export interface Book {
  bookId: string;
  authors: string[];
  title: string;
  description: string;
  image: string;
  link?: string; // Make this optional if it is not always available
}
