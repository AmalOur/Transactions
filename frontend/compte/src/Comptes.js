import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACCOUNTS } from './queries';
import { SAVE_COMPTE } from './mutations';

const Comptes = () => {
  const { data: accountsData, loading, error } = useQuery(GET_ACCOUNTS);
  const [saveCompte] = useMutation(SAVE_COMPTE);

  const [newCompte, setNewCompte] = useState({
    solde: '',
    dateCreation: '',
    type: 'COURANT',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCompte = async () => {
    try {
      if (!newCompte.solde || !newCompte.dateCreation) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      await saveCompte({
        variables: { compte: { ...newCompte, solde: parseFloat(newCompte.solde) } },
      });

      setNewCompte({ solde: '', dateCreation: '', type: 'COURANT' });
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to save account: ' + err.message);
    }
  };

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p>Error loading accounts: {error.message}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Accounts</h2>
      <ul className="space-y-4">
        {accountsData?.allComptes?.map((compte) => (
          <li key={compte.id} className="bg-white border p-4 rounded-lg shadow-lg">
            <span className="font-medium text-gray-700">
              {compte.type} - {compte.solde.toFixed(2)}€
            </span>
          </li>
        ))}
      </ul>

      <div className="bg-white border p-6 rounded-lg shadow-lg space-y-4">
        <h3 className="text-xl font-semibold">Add New Account</h3>
        <input
          type="number"
          placeholder="Solde"
          value={newCompte.solde}
          onChange={(e) => setNewCompte({ ...newCompte, solde: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={newCompte.dateCreation}
          onChange={(e) => setNewCompte({ ...newCompte, dateCreation: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newCompte.type}
          onChange={(e) => setNewCompte({ ...newCompte, type: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="COURANT">COURANT</option>
          <option value="EPARGNE">EPARGNE</option>
        </select>
        <button
          onClick={handleAddCompte}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Account
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Comptes;