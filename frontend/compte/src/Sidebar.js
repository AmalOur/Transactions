import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { SAVE_COMPTE, SAVE_TRANSACTION } from './mutations';
import { GET_ACCOUNTS, GET_TRANSACTIONS } from './queries';

const Sidebar = () => {
  const { data: accountsData, loading: accountsLoading, error: accountsError } = useQuery(GET_ACCOUNTS);
  const { data: transactionsData, loading: transactionsLoading, error: transactionsError } = useQuery(GET_TRANSACTIONS);

  const [saveCompte] = useMutation(SAVE_COMPTE);
  const [saveTransaction] = useMutation(SAVE_TRANSACTION);

  const [newCompte, setNewCompte] = useState({ solde: '', dateCreation: '', type: 'COURANT' });
  const [newTransaction, setNewTransaction] = useState({ montant: '', type: 'DEPOT', date: '', compte: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCompte = async () => {
    try {
      if (!newCompte.solde || !newCompte.dateCreation) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(newCompte.solde),
            dateCreation: newCompte.dateCreation,
            type: newCompte.type,
          },
        },
      });

      setNewCompte({ solde: '', dateCreation: '', type: 'COURANT' });
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to save compte: ' + err.message);
    }
  };

  const handleAddTransaction = async () => {
    try {
      if (!newTransaction.date || !newTransaction.montant || !newTransaction.compte) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      await saveTransaction({
        variables: {
          transaction: {
            date: newTransaction.date,
            type: newTransaction.type,
            montant: parseFloat(newTransaction.montant),
            compte: newTransaction.compte,
          },
        },
      });

      setNewTransaction({ date: '', type: 'DEPOT', montant: '', compte: '' });
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to save transaction: ' + err.message);
    }
  };

  return (
    <div className="flex">
      <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6 shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          Financial Dashboard
        </h2>

        {/* Accounts Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-indigo-300">Accounts</h3>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => document.getElementById('add-account-modal').classList.remove('hidden')}
            >
              + Add Account
            </button>
          </div>

          {accountsLoading ? (
            <div className="text-center text-gray-400 animate-pulse">Loading accounts...</div>
          ) : accountsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              Error loading accounts: {accountsError.message}
            </div>
          ) : (
            <div className="space-y-4">
              {accountsData?.allComptes?.map((compte) => (
                <div 
                  key={compte.id} 
                  className="bg-gray-700 hover:bg-gray-600 transition duration-300 p-4 rounded-xl shadow-md border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg text-indigo-300">{compte.type} Account</span>
                    <span className="text-green-400 font-bold">{compte.solde}€</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Account Balance
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-indigo-300">Transactions</h3>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => document.getElementById('add-transaction-modal').classList.remove('hidden')}
            >
              + Add Transaction
            </button>
          </div>

          {transactionsLoading ? (
            <div className="text-center text-gray-400 animate-pulse">Loading transactions...</div>
          ) : transactionsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              Error loading transactions: {transactionsError.message}
            </div>
          ) : (
            <div className="space-y-4">
              {transactionsData?.allTransactions?.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="bg-gray-700 hover:bg-gray-600 transition duration-300 p-4 rounded-xl shadow-md border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg text-green-400">{transaction.type}</span>
                    <span className="text-indigo-300 font-bold">{transaction.montant}€</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Account: {transaction.compte.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Modals for Adding Account and Transaction */}
        <div id="add-account-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-indigo-300">Add New Account</h2>
            <input
              type="number"
              placeholder="Initial Balance"
              value={newCompte.solde}
              onChange={(e) => setNewCompte({...newCompte, solde: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            />
            <input
              type="date"
              value={newCompte.dateCreation}
              onChange={(e) => setNewCompte({...newCompte, dateCreation: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            />
            <select
              value={newCompte.type}
              onChange={(e) => setNewCompte({...newCompte, type: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            >
              <option value="COURANT">Current Account</option>
              <option value="EPARGNE">Savings Account</option>
            </select>
            <div className="flex justify-between">
              <button 
                onClick={handleAddCompte}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Account
              </button>
              <button 
                onClick={() => document.getElementById('add-account-modal').classList.add('hidden')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div id="add-transaction-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-indigo-300">Add New Transaction</h2>
            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.montant}
              onChange={(e) => setNewTransaction({...newTransaction, montant: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            />
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            />
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            >
              <option value="DEPOT">Deposit</option>
              <option value="RETRAIT">Withdrawal</option>
            </select>
            <input
              type="text"
              placeholder="Account ID"
              value={newTransaction.compte}
              onChange={(e) => setNewTransaction({...newTransaction, compte: e.target.value})}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
            />
            <div className="flex justify-between">
              <button 
                onClick={handleAddTransaction}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save Transaction
              </button>
              <button 
                onClick={() => document.getElementById('add-transaction-modal').classList.add('hidden')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;