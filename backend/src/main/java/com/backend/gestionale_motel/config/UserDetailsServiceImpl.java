package com.backend.gestionale_motel.config;

import com.backend.gestionale_motel.entity.Utente;
import com.backend.gestionale_motel.repository.UtenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementazione di UserDetailsService per Spring Security.
 *
 * Responsabilità:
 * - Caricare l'utente dal database durante il login (per username)
 * - Caricare l'utente dal database durante validazione token JWT (per ID)
 * - Convertire l'entità Utente in UserDetailsImpl
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtenteRepository utenteRepository;

    /**
     * Carica l'utente per username (usato durante il login).
     *
     * Chiamato da AuthenticationManager quando l'utente fa login.
     *
     * @param username Username dell'utente
     * @return UserDetails con i dati dell'utente (UserDetailsImpl)
     * @throws UsernameNotFoundException se l'utente non esiste
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utente utente = utenteRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                "Utente non trovato con username: " + username
            ));

        return UserDetailsImpl.build(utente);
    }

    /**
     * Carica l'utente per ID (usato durante validazione token JWT).
     *
     * Il token JWT contiene l'ID utente nel claim 'sub'.
     * Questo metodo carica l'utente dal database usando l'ID.
     *
     * Vantaggi:
     * - Se lo username cambia, il token continua a funzionare
     * - L'ID è immutabile (chiave primaria)
     *
     * @param id ID dell'utente
     * @return UserDetails con i dati dell'utente (UserDetailsImpl)
     * @throws UsernameNotFoundException se l'utente non esiste
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        Utente utente = utenteRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException(
                "Utente non trovato con ID: " + id
            ));

        return UserDetailsImpl.build(utente);
    }
}