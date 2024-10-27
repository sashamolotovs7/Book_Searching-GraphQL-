/// <reference types="vite/client" />
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Import components and pages
import App from './App';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

// Create the HTTP link for the Apollo Client
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_PROD === 'true' // Check the VITE_PROD variable as a string
    ? import.meta.env.VITE_REACT_APP_GRAPHQL_URI_PRODUCTION
    : import.meta.env.VITE_REACT_APP_GRAPHQL_URI_LOCAL,
});

// Set up authentication context to send the token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create Apollo Client and include authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Set up React Router for navigating between pages
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />,
      },
      {
        path: '/saved',
        element: <SavedBooks />,
      },
    ],
  },
]);

// Get the root element and throw an error if not found
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Unable to render the app.");
}

// Use a type assertion to let TypeScript know that rootElement is not null
const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
