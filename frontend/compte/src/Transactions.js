import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    allTransactions {
      id
      date
      montant
      type
      compte {
        id
        solde
      }
    }
  }
`;

const SAVE_TRANSACTION = gql`
  mutation SaveTransaction($transaction: TransactionInput!) {
    saveTransaction(transaction: $transaction) {
      id
      date
      type
      montant
      compte {
        id
        solde
      }
    }
  }
`;

function Transactions() {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);
  const [saveTransaction] = useMutation(SAVE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
  });

  const [newTransaction, setNewTransaction] = useState({
    date: '',
    type: 'DEPOT',
    montant: '',
    compteId: '',
  });

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      if (!newTransaction.date || !newTransaction.montant || !newTransaction.compteId) {
        alert('Please fill in all fields.');
        return;
      }

      await saveTransaction({
        variables: {
          transaction: {
            date: newTransaction.date || new Date().toISOString(),
            type: newTransaction.type,
            montant: parseFloat(newTransaction.montant),
            compteId: newTransaction.compteId,
          },
        },
      });

      setNewTransaction({ date: '', type: 'DEPOT', montant: '', compteId: '' });
    } catch (err) {
      alert('Failed to save transaction: ' + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Transactions</h2>

      <form onSubmit={handleAddTransaction} className="bg-white border p-6 rounded-lg shadow-lg space-y-4">
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DEPOT">DEPOT</option>
          <option value="RETRAIT">RETRAIT</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.montant}
          onChange={(e) => setNewTransaction({ ...newTransaction, montant: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          placeholder="Account ID"
          value={newTransaction.compteId}
          onChange={(e) => setNewTransaction({ ...newTransaction, compteId: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Transaction
        </button>
      </form>

      <div className="bg-white border p-6 rounded-lg shadow-lg space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Existing Transactions</h3>
        {data.allTransactions.length > 0 ? (
          data.allTransactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between">
              <span className="font-medium text-gray-700">
                {transaction.type} - {transaction.montant}€ on {transaction.date}
              </span>
              <span className="text-sm text-gray-500">Account ID: {transaction.compte.id}</span>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default Transactions;