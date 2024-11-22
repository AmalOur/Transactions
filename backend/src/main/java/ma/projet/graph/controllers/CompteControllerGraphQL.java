package ma.projet.graph.controllers;

import lombok.AllArgsConstructor;
import ma.projet.graph.entities.Compte;
import ma.projet.graph.entities.CompteRequest;
import ma.projet.graph.entities.TypeCompte;
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
public class CompteControllerGraphQL {

    private CompteRepository compteRepository;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");


    @QueryMapping
    public List<Compte> allComptes(){
        return compteRepository.findAll();
    }

    @QueryMapping
    public Compte compteById(@Argument Long id){
        Compte compte =  compteRepository.findById(id).orElse(null);
        if(compte == null) throw new RuntimeException(String.format("Compte %s not found", id));
        else return compte;
    }

    @MutationMapping
    public Compte saveCompte(@Argument("compte") Map<String, Object> compteMap) {
        if (compteMap == null || compteMap.isEmpty()) {
            throw new RuntimeException("CompteRequest input is missing or empty.");
        }

        // Manually map the input to Compte object
        Compte compte = new Compte();
        compte.setSolde((Double) compteMap.get("solde"));
        compte.setType(TypeCompte.valueOf((String) compteMap.get("type")));

        try {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            compte.setDateCreation(dateFormat.parse((String) compteMap.get("dateCreation")));
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format. Expected 'yyyy-MM-dd'.", e);
        }

        return compteRepository.save(compte);
    }



    @QueryMapping
    public Map<String, Object> totalSolde() {
        long count = compteRepository.count(); // Nombre total de comptes
        double sum = compteRepository.sumSoldes(); // Somme totale des soldes
        double average = count > 0 ? sum / count : 0; // Moyenne des soldes

        return Map.of(
                "count", count,
                "sum", sum,
                "average", average
        );
    }
}
