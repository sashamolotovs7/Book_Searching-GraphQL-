import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Set up the HTTP link for Apollo Client to communicate with the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql', // The GraphQL endpoint (adjust if necessary)
});

// Set up authentication with the Authorization header, passing the JWT token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token'); // Get JWT from localStorage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach the token if available
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
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
