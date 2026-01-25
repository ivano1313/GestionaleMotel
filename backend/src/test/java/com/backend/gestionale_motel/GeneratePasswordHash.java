package com.backend.gestionale_motel;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String password = "admin123";
        String hash = encoder.encode(password);

        System.out.println("Password: " + password);
        System.out.println("Hash BCrypt: " + hash);
        System.out.println("Verifica: " + encoder.matches(password, hash));
    }
}
