import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import App from './App';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_PROD === 'true'
    ? import.meta.env.VITE_REACT_APP_GRAPHQL_URI_PRODUCTION
    : import.meta.env.VITE_REACT_APP_GRAPHQL_URI_LOCAL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Unable to render the app.");
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
