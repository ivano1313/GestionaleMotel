package com.backend.gestionale_motel;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHashTest {

    @Test
    public void testPasswordHash() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "admin123";
        String hash1 = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG";
        String hash2 = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8FvFhGWKkEDH2OJPvO";

        System.out.println("=== TEST PASSWORD HASH ===");
        System.out.println("Password testata: " + password);
        System.out.println();

        System.out.println("Hash V18 (attuale nel DB): " + hash1);
        System.out.println("Verifica hash V18: " + encoder.matches(password, hash1));
        System.out.println();

        System.out.println("Hash V17 (precedente): " + hash2);
        System.out.println("Verifica hash V17: " + encoder.matches(password, hash2));
        System.out.println();

        // Genera un nuovo hash per confronto
        String newHash = encoder.encode(password);
        System.out.println("Nuovo hash generato: " + newHash);
        System.out.println("Verifica nuovo hash: " + encoder.matches(password, newHash));
    }
}
