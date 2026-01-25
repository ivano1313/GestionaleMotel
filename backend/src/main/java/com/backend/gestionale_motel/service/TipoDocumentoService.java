package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.TipoDocumentoDTO;
import com.backend.gestionale_motel.entity.TipoDocumento;
import com.backend.gestionale_motel.repository.TipoDocumentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service per la gestione dei TipiDocumento (tabella lookup)
 */
@Service
@RequiredArgsConstructor
public class TipoDocumentoService {

    private final TipoDocumentoRepository tipoDocumentoRepository;

    public List<TipoDocumentoDTO> findAll() {
        return tipoDocumentoRepository.findAll().stream()
                .filter(TipoDocumento::getAttivo)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TipoDocumentoDTO toDTO(TipoDocumento entity) {
        return TipoDocumentoDTO.builder()
                .id(entity.getId())
                .sigla(entity.getSigla())
                .descrizione(entity.getDescrizione())
                .attivo(entity.getAttivo())
                .build();
    }
}
