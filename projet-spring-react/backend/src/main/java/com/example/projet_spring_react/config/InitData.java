// package com.example.projet_spring_react.config;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import com.example.projet_spring_react.model.Employe;
// import com.example.projet_spring_react.repository.EmployeRepository;

// @Configuration
// public class InitData {

//     @Bean
//     CommandLineRunner initDatabase(EmployeRepository repository) {
//         return args -> {
//             // Ajout d'employés pour les tests
//             repository.save(new Employe("Dupont", "Jean", "Développement", 50000.0));
//             repository.save(new Employe("Martin", "Sophie", "Marketing", 45000.0));
//             repository.save(new Employe("Bernard", "Thomas", "Ventes", 48000.0));
//             repository.save(new Employe("Petit", "Marie", "Développement", 52000.0));
//             repository.save(new Employe("Robert", "Nicolas", "Ressources Humaines", 42000.0));
//             repository.save(new Employe("Richard", "Julie", "Finance", 55000.0));
//             repository.save(new Employe("Durand", "Michel", "Marketing", 47000.0));
//             repository.save(new Employe("Leroy", "Laura", "Ventes", 46000.0));
//             repository.save(new Employe("Moreau", "Philippe", "Développement", 53000.0));
//             repository.save(new Employe("Simon", "Camille", "Ressources Humaines", 44000.0));
//             repository.save(new Employe("sara", "bah", "Développement", 90000.0));
//         };
//     }
// }