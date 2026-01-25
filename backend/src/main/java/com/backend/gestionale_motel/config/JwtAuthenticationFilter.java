package com.backend.gestionale_motel.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro JWT che intercetta ogni richiesta HTTP per validare il token.
 *
 * Responsabilità:
 * 1. Estrae il token JWT dall'header Authorization
 * 2. Valida il token (firma, scadenza)
 * 3. Carica l'utente dal database usando l'ID dal token
 * 4. Imposta il SecurityContext per la richiesta
 *
 * Viene eseguito UNA SOLA VOLTA per ogni richiesta (OncePerRequestFilter)
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    /**
     * Filtra ogni richiesta HTTP per validare il token JWT.
     *
     * @param request Richiesta HTTP
     * @param response Risposta HTTP
     * @param filterChain Catena di filtri
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // 1. Estrae il token dall' header Authorization
            String jwt = getJwtFromRequest(request);

            // 2. Valida il token
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {

                // 3. Estrae l' ID utente dal token (claim 'sub')
                Long userId = jwtTokenProvider.getUserIdFromToken(jwt);

                // 4. Carica l'utente dal database usando l'ID
                //    IMPORTANTE: Usa loadUserById() invece di loadUserByUsername()
                //    perché il token contiene l'ID (immutabile), non lo username
                UserDetails userDetails = userDetailsService.loadUserById(userId);

                // 5. Crea l'oggetto Authentication per Spring Security
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,  // Credentials non necessarie (già autenticato)
                                userDetails.getAuthorities()
                        );

                // 6. Imposta dettagli della richiesta
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 7. Imposta il SecurityContext
                //    Ora Spring Security sa che l'utente è autenticato
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Log dell'errore ma NON blocca la richiesta
            // Lascia che Spring Security gestisca l'accesso non autenticato
            logger.error("Impossibile impostare autenticazione utente nel security context", ex);
        }

        // 8. Continua con la catena di filtri
        filterChain.doFilter(request, response);
    }

    /**
     * Estrae il token JWT dall'header Authorization della richiesta.
     *
     * Header formato: "Authorization: Bearer <token>"
     *
     * @param request Richiesta HTTP
     * @return Token JWT (senza il prefisso "Bearer "), oppure null se non presente
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Verifica che l'header esista e inizi con "Bearer "
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // Rimuove il prefisso "Bearer " e ritorna solo il token
            return bearerToken.substring(7);
        }

        return null;
    }
}
