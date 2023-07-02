import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    console.log('logged out');
    setPage('books')
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('library-user-token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });

  const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
  });

  const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:4000',
  }))
  

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    authLink.concat(httpLink)
  )

  const client = new ApolloClient({
    //link: ApolloLink.from([authLink, httpLink]),
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          {token ? (
            <>
              <button onClick={() => setPage('recommendations')}>
                recommendations
              </button>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={logout}>logout</button>
            </>
          ) : (
            <button onClick={() => setPage('loginform')}>login</button>
          )}
        </div>

        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        <Recommended show={page === 'recommendations'} />
        <NewBook show={page === 'add'} />
        <LoginForm show={page === 'loginform'} setToken={setToken} setPage={setPage} />
      </div>
    </ApolloProvider>
  );
};

export default App;