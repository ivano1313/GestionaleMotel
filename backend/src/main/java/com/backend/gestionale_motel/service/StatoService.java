package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.StatoDTO;
import com.backend.gestionale_motel.entity.Stato;
import com.backend.gestionale_motel.repository.StatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service per la gestione degli Stati (tabella lookup)
 */
@Service
@RequiredArgsConstructor
public class StatoService {

    private final StatoRepository statoRepository;

    public List<StatoDTO> findAll() {
        return statoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<StatoDTO> searchByNome(String nome) {
        return statoRepository.findByNomeContaining(nome).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private StatoDTO toDTO(Stato entity) {
        return StatoDTO.builder()
                .id(entity.getId())
                .codice(entity.getCodice())
                .nome(entity.getNome())
                .build();
    }
}
