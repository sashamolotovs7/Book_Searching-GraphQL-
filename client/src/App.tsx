import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Set up the HTTP link for Apollo Client to communicate with the GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Full URL to GraphQL endpoint
});

// Set up authentication with the Authorization header, passing the JWT token
const authLink = setContext((_, { headers }) => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('id_token');
  
  // Return the headers with the Authorization token included
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Set Bearer token if available
    },
  };
});

// Set up Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine the auth link and the HTTP link
  cache: new InMemoryCache(), // Set up cache management
});

function App() {
  return (
    <ApolloProvider client={client}> {/* Provide the Apollo client to the app */}
      <Navbar />
      <Outlet /> {/* Render the current page */}
    </ApolloProvider>
  );
}

export default App;
