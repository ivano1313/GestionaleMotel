package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.ConfigurazioneDTO;
import com.backend.gestionale_motel.entity.Configurazione;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.ConfigurazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfigurazioneService {

    private final ConfigurazioneRepository configurazioneRepository;

    /**
     * Ottiene la configurazione singleton (id = 1)
     */
    public ConfigurazioneDTO get() {
        Configurazione config = configurazioneRepository.findSingleton()
                .orElseThrow(() -> new ResourceNotFoundException("Configurazione non trovata"));
        return toDTO(config);
    }

    /**
     * Aggiorna la configurazione singleton
     */
    @Transactional
    public ConfigurazioneDTO update(ConfigurazioneDTO dto) {
        Configurazione config = configurazioneRepository.findSingleton()
                .orElseGet(() -> {
                    // Se non esiste, crea una nuova configurazione con id = 1
                    Configurazione newConfig = new Configurazione();
                    newConfig.setId(1L);
                    return newConfig;
                });

        config.setOrarioCheckin(dto.getOrarioCheckin());
        config.setOrarioCheckout(dto.getOrarioCheckout());
        config.setDurataMinima(dto.getDurataMinima());
        config.setDurataMassima(dto.getDurataMassima());

        Configurazione updated = configurazioneRepository.save(config);
        return toDTO(updated);
    }

    private ConfigurazioneDTO toDTO(Configurazione entity) {
        return ConfigurazioneDTO.builder()
                .id(entity.getId())
                .orarioCheckin(entity.getOrarioCheckin())
                .orarioCheckout(entity.getOrarioCheckout())
                .durataMinima(entity.getDurataMinima())
                .durataMassima(entity.getDurataMassima())
                .build();
    }
}

