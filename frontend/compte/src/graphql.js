import { gql } from '@apollo/client';

export const GET_COMPTES = gql`
  query GetComptes {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

export const ADD_COMPTE = gql`
  mutation AddCompte($compte: CompteInput!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
    }
  }
`;
