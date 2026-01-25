package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.ComuneDTO;
import com.backend.gestionale_motel.entity.Comune;
import com.backend.gestionale_motel.repository.ComuneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service per la gestione dei Comuni (tabella lookup)
 */
@Service
@RequiredArgsConstructor
public class ComuneService {

    private final ComuneRepository comuneRepository;

    public List<ComuneDTO> findAll() {
        return comuneRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ComuneDTO> searchByNome(String nome) {
        return comuneRepository.findByNomeContaining(nome).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ComuneDTO> findByProvincia(String provincia) {
        return comuneRepository.findByProvincia(provincia.toUpperCase()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ComuneDTO toDTO(Comune entity) {
        return ComuneDTO.builder()
                .id(entity.getId())
                .codice(entity.getCodice())
                .nome(entity.getNome())
                .provincia(entity.getProvincia())
                .build();
    }
}
