package com.swp391.superapp.bloodsupport.infra;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JpaUtil {
    private static final EntityManagerFactory emf;
    static {
        try {
            emf = Persistence.createEntityManagerFactory("com.chillguy.superapp-PU");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    private JpaUtil() {
    }
    public static EntityManager getEntityManager() {
        return emf.createEntityManager();
    }
    public static void closeEntityManager(EntityManager em) {
        em.close();
    }
}
