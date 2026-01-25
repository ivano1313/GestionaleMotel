package com.backend.gestionale_motel.config;

import com.backend.gestionale_motel.entity.Ruolo;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Provider per la generazione e validazione dei token JWT.
 *
 * Responsabilità:
 * - Generare token JWT con claims (sub, username, role, iat, exp)
 * - Validare firma e scadenza dei token
 * - Estrarre informazioni (username, claims) dai token
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey secretKey;

    /**
     * Inizializza la chiave segreta dopo l'iniezione delle properties.
     * La chiave viene generata da jwtSecret usando HMAC-SHA algoritmo sicuro.
     */
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Genera un token JWT per l'utente autenticato.
     *
     * Usa l'ID utente nel claim 'sub' (identificatore immutabile)
     * invece dello username che potrebbe cambiare nel tempo.
     *
     * Struttura del token (conforme alle specifiche):
     * - sub: ID univoco dell'utente (IMMUTABILE)
     * - username: Nome utente per visualizzazione (può cambiare)
     * - role: Ruolo utente (ADMIN per v1)
     * - iat: Timestamp di emissione
     * - exp: Timestamp di scadenza (24 ore)
     *
     * @param authentication Oggetto Authentication di Spring Security
     * @return Token JWT firmato
     */
    public String generateToken(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Ruolo ruolo = userDetails.getRuolo();
        String ruoloString = ruolo.name();

        return generateToken(
            userDetails.getId(),
            userDetails.getUsername(),
            ruoloString
        );
    }

    /**
     * Genera un token JWT con parametri espliciti.
     *
     * Questo metodo permette di generare token senza dover creare
     * un oggetto Authentication, utile per casi d'uso custom.
     *
     * @param userId ID univoco dell'utente (IMMUTABILE)
     * @param username Nome utente per visualizzazione
     * @param role Ruolo utente (es. "ADMIN", "RECEPTIONIST")
     * @return Token JWT firmato
     */
    public String generateToken(Long userId, String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(String.valueOf(userId))  // sub: ID utente (IMMUTABILE)
                .claim("username", username)  // username per visualizzazione
                .claim("role", role)  // ruolo utente
                .issuedAt(now)  // iat: timestamp emissione
                .expiration(expiryDate)  // exp: timestamp scadenza
                .signWith(secretKey)  // firma con chiave segreta
                .compact();
    }

    /**
     * Estrae l'ID utente dal token JWT.
     *
     * IMPORTANTE: Il claim 'sub' contiene l'ID utente (identificatore immutabile),
     * non lo username che potrebbe cambiare nel tempo.
     *
     * @param token Token JWT
     * @return ID utente contenuto nel claim 'sub'
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.valueOf(claims.getSubject());
    }

    /**
     * Estrae lo username dal token JWT.
     *
     * NOTA: Lo username è nel claim custom 'username', non nel 'sub'.
     * Il 'sub' contiene l'ID utente.
     *
     * @param token Token JWT
     * @return Username contenuto nel claim 'username'
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("username", String.class);
    }

    /**
     * Estrae il ruolo dal token JWT.
     *
     * @param token Token JWT
     * @return Ruolo contenuto nel claim 'role'
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("role", String.class);
    }

    /**
     * Valida il token JWT.
     *
     * Verifica:
     * - Firma corretta (con la chiave segreta)
     * - Token non scaduto
     * - Formato valido
     *
     * @param token Token JWT da validare
     * @return true se il token è valido, false altrimenti
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException ex) {
            // Firma JWT non valida
            System.err.println("Firma JWT non valida: " + ex.getMessage());
        } catch (MalformedJwtException ex) {
            // Token JWT malformato
            System.err.println("Token JWT malformato: " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            // Token JWT scaduto
            System.err.println("Token JWT scaduto: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            // Token JWT non supportato
            System.err.println("Token JWT non supportato: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            // Claims string vuota
            System.err.println("JWT claims string vuota: " + ex.getMessage());
        }
        return false;
    }

    /**
     * Estrae tutti i claims dal token JWT.
     * Utile per accedere a informazioni personalizzate nel token.
     *
     * @param token Token JWT
     * @return Claims contenuti nel token
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Verifica se il token è scaduto.
     *
     * @param token Token JWT
     * @return true se il token è scaduto, false altrimenti
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException ex) {
            return true;
        }
    }
}
