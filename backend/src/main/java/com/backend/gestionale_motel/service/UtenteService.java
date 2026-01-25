package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.entity.Utente;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.UtenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UtenteService {
    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;



    public Utente findByUsername(String username) {
        return utenteRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato"));
    }

    @Transactional
    public void updateUltimoAccesso(Long id) {
        Utente utente = utenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utente", id));
        utente.setUltimoAccesso(LocalDateTime.now());
        utenteRepository.save(utente);
    }
    @Transactional
    public void cambiaPassword(Long id, String nuovaPassword) {
        Utente utente = utenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utente", id));
        utente.setPassword(passwordEncoder.encode(nuovaPassword));
        utenteRepository.save(utente);
    }
    @Transactional
    public void disattivaUtente(Long id) {
        Utente utente = utenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utente", id));
        utente.setAttivo(false);
        utenteRepository.save(utente);
    }
}

