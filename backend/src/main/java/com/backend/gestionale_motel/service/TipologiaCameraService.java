package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.TipologiaCameraDTO;
import com.backend.gestionale_motel.entity.TipologiaCamera;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.TipologiaCameraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TipologiaCameraService {

    private final TipologiaCameraRepository tipologiaCameraRepository;

    public List<TipologiaCameraDTO> findAll() {
        return tipologiaCameraRepository.findByAttivo(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TipologiaCameraDTO create(TipologiaCameraDTO dto) {
        TipologiaCamera tipologia = TipologiaCamera.builder()
                .nome(dto.getNome())
                .capienzaMassima(dto.getCapienzaMassima())
                .attivo(dto.getAttivo() != null ? dto.getAttivo() : true)
                .build();

        TipologiaCamera saved = tipologiaCameraRepository.save(tipologia);
        return toDTO(saved);
    }

    @Transactional
    public TipologiaCameraDTO update(Long id, TipologiaCameraDTO dto) {
        TipologiaCamera tipologia = tipologiaCameraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", id));

        tipologia.setNome(dto.getNome());
        tipologia.setCapienzaMassima(dto.getCapienzaMassima());
        if (dto.getAttivo() != null) {
            tipologia.setAttivo(dto.getAttivo());
        }

        TipologiaCamera updated = tipologiaCameraRepository.save(tipologia);
        return toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        TipologiaCamera tipologia = tipologiaCameraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", id));
        tipologia.setAttivo(false);
        tipologiaCameraRepository.save(tipologia);
    }

    private TipologiaCameraDTO toDTO(TipologiaCamera entity) {
        return TipologiaCameraDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .capienzaMassima(entity.getCapienzaMassima())
                .attivo(entity.getAttivo())
                .build();
    }
}
