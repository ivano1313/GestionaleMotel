package com.backend.gestionale_motel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configurazione CORS (Cross-Origin Resource Sharing).
 *
 * Permette al frontend Angular (localhost:4200) di comunicare
 * con il backend Spring Boot (localhost:8080).
 */
@Configuration
public class CorsConfig {

    /**
     * Configura CORS per permettere richieste dal frontend Angular.
     *
     * @return CorsConfigurationSource configurato
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origini permesse (frontend Angular)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:4200",
            "http://127.0.0.1:4200"
        ));

        // Metodi HTTP permessi
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Header permessi
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));

        // Header esposti al client
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type"
        ));

        // Permetti credenziali (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Tempo di cache della preflight request (in secondi)
        configuration.setMaxAge(3600L);

        // Applica la configurazione a tutti gli endpoint
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
