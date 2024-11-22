import { gql, useMutation } from '@apollo/client';

const SAVE_COMPTE = gql`
    mutation SaveCompte($compte: CompteRequest!) {
        saveCompte(compte: $compte) {
            id
            solde
            dateCreation
            type
        }
    }
`;

const AddCompte = () => {
    const [saveCompte, { data, loading, error }] = useMutation(SAVE_COMPTE);

    const handleAddCompte = () => {
        saveCompte({
            variables: {
                compte: {
                    solde: 1000.0,
                    dateCreation: "2024-11-22",
                    type: "COURANT",
                },
            },
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={handleAddCompte}>Add Compte</button>
            {data && <p>Compte added with ID: {data.saveCompte.id}</p>}
        </div>
    );
};
