import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    allTransactions {
      id
      date
      montant
      type
      compte {
        id
      }
    }
  }
`;
