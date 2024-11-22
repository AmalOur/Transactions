import { gql } from '@apollo/client';

export const SAVE_COMPTE = gql`
  mutation SaveCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
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
        dateCreation
        type
      }
    }
  }
`;