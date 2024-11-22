import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Comptes from './Comptes';
import Transactions from './Transactions';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <Comptes />
        <Transactions />
      </div>
    </ApolloProvider>
  );
}

export default App;
