package com.example.demo;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;

import org.springframework.beans.factory.annotation.Autowired;

public class YourService {

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public void yourMethod() {
        EntityManager entityManager = entityManagerFactory.createEntityManager();

        try {
            // Use o EntityManager para interagir com o banco de dados

            EntityTransaction transaction = entityManager.getTransaction();
            transaction.begin();

            // Realize operações de persistência e/ou consulta com o EntityManager

            transaction.commit();
        } finally {
            entityManager.close();
        }
    }
}
