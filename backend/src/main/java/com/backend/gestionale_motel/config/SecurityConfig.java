package com.backend.gestionale_motel.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Configurazione Spring Security per autenticazione JWT.
 *
 * Configurazione:
 * - Autenticazione stateless (nessuna sessione HTTP)
 * - Endpoint pubblici: /api/auth/**, /api/health
 * - Endpoint protetti: tutti gli altri /api/**
 * - Filtro JWT per validare token
 * - Password encoder BCrypt
 * - CORS abilitato
 * - CSRF disabilitato (non necessario per API stateless)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    /**
     * Configura la catena di filtri di sicurezza.
     *
     * @param http HttpSecurity builder
     * @return SecurityFilterChain configurato
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disabilita CSRF (non necessario per API REST stateless con JWT)
            .csrf(AbstractHttpConfigurer::disable)

            // Configura CORS (Cross-Origin Resource Sharing)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // Configura le autorizzazioni per gli endpoint
            .authorizeHttpRequests(auth -> auth
                // Endpoint PUBBLICI (accessibili senza autenticazione)
                .requestMatchers("/api/auth/**").permitAll()  // Login, registrazione
                .requestMatchers("/api/health").permitAll()   // Health check

                // Tutti gli altri endpoint richiedono autenticazione
                .requestMatchers("/api/**").authenticated()

                // Per sicurezza, nega tutto il resto
                .anyRequest().denyAll()
            )

            // Configura gestione sessioni: STATELESS (no sessioni HTTP)
            // Spring Security NON crea né usa sessioni
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Configura il provider di autenticazione
            .authenticationProvider(authenticationProvider())

            // Aggiunge il filtro JWT PRIMA del filtro standard di Spring Security
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /**
     * Bean per l'AuthenticationManager.
     * Usato nel AuthController per autenticare le credenziali durante il login.
     *
     * @param config AuthenticationConfiguration di Spring
     * @return AuthenticationManager
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Provider di autenticazione DAO (Database Authentication).
     * Collega UserDetailsService e PasswordEncoder.
     *
     * @return DaoAuthenticationProvider configurato
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        // Imposta UserDetailsService per caricare utenti dal database
        authProvider.setUserDetailsService(userDetailsService);

        // Imposta PasswordEncoder per verificare le password
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    /**
     * Bean per il PasswordEncoder.
     * Usa BCrypt con strength 10 (default).
     *
     * BCrypt caratteristiche:
     * - Hash one-way (non reversibile)
     * - Salt automatico (diverso per ogni password)
     * - Adaptive (può aumentare la complessità nel tempo)
     *
     * @return BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

