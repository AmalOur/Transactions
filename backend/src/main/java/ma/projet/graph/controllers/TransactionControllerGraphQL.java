package ma.projet.graph.controllers;

import lombok.AllArgsConstructor;
import ma.projet.graph.entities.*;
import ma.projet.graph.repositories.TransactionRepository;
import ma.projet.graph.repositories.CompteRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class TransactionControllerGraphQL {

    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;

    @QueryMapping
    public List<Transaction> allTransactions() {
        return transactionRepository.findAll();
    }

    @MutationMapping
    public Transaction saveTransaction(@Argument TransactionInput transaction) {
        // Retrieve the account (compte) by ID
        Compte compte = compteRepository.findById(transaction.getCompteId())
                .orElseThrow(() -> new RuntimeException("Compte not found"));

        // Create new Transaction object and set its attributes
        Transaction newTransaction = new Transaction();
        newTransaction.setDate(transaction.getDate());
        newTransaction.setType(transaction.getType());
        newTransaction.setMontant(transaction.getMontant());
        newTransaction.setCompte(compte);

        if (transaction.getType() == TypeTransaction.DEPOT) {
            // Add the amount to the account balance (solde)
            compte.setSolde(compte.getSolde() + transaction.getMontant());
        } else if (transaction.getType() == TypeTransaction.RETRAIT) {
            // Subtract the amount from the account balance (solde)
            if (compte.getSolde() >= transaction.getMontant()) {
                compte.setSolde(compte.getSolde() - transaction.getMontant());
            } else {
                throw new RuntimeException("Insufficient funds for withdrawal");
            }
        } else {
            throw new RuntimeException("Invalid transaction type");
        }

        // Save the updated account (compte)
        compteRepository.save(compte);

        // Save and return the transaction
        return transactionRepository.save(newTransaction);
    }
}