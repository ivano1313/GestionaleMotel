package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.config.JwtTokenProvider;
import com.backend.gestionale_motel.dto.LoginRequest;
import com.backend.gestionale_motel.dto.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller per l'autenticazione degli utenti.
 *
 * Endpoint:
 * - POST /api/auth/login → Autenticazione e generazione token JWT
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Endpoint per il login utente.
     *
     * Flusso:
     * 1. Riceve username e password
     * 2. Autentica con Spring Security
     * 3. Genera token JWT
     * 4. Ritorna token al frontend
     *
     * @param loginRequest DTO con username e password
     * @return LoginResponse con token JWT
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {

        // 1. Crea token di autenticazione con username e password
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        // 2. Imposta l'autenticazione nel SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Genera token JWT
        String jwt = jwtTokenProvider.generateToken(authentication);

        // 4. Ritorna il token nella response
        return ResponseEntity.ok(new LoginResponse(jwt));
    }
}
