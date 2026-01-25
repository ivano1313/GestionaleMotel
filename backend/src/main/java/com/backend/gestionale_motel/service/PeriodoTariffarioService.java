package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.PeriodoTariffarioDTO;
import com.backend.gestionale_motel.entity.PeriodoTariffario;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.PeriodoTariffarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeriodoTariffarioService {

    private final PeriodoTariffarioRepository periodoTariffarioRepository;

    public List<PeriodoTariffarioDTO> findAll() {
        return periodoTariffarioRepository.findByAttivo(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PeriodoTariffarioDTO findById(Long id) {
        PeriodoTariffario periodo = periodoTariffarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PeriodoTariffario", id));
        return toDTO(periodo);
    }

    public PeriodoTariffarioDTO findPeriodoPerData(LocalDate data) {
        PeriodoTariffario periodo = periodoTariffarioRepository.findPeriodoPerData(data)
                .orElseThrow(() -> new ResourceNotFoundException("Nessun periodo tariffario trovato per la data: " + data));
        return toDTO(periodo);
    }

    @Transactional
    public PeriodoTariffarioDTO create(PeriodoTariffarioDTO dto) {
        PeriodoTariffario periodo = PeriodoTariffario.builder()
                .nome(dto.getNome())
                .dataInizio(dto.getDataInizio())
                .dataFine(dto.getDataFine())
                .attivo(dto.getAttivo() != null ? dto.getAttivo() : true)
                .build();

        PeriodoTariffario saved = periodoTariffarioRepository.save(periodo);
        return toDTO(saved);
    }

    @Transactional
    public PeriodoTariffarioDTO update(Long id, PeriodoTariffarioDTO dto) {
        PeriodoTariffario periodo = periodoTariffarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PeriodoTariffario", id));

        periodo.setNome(dto.getNome());
        periodo.setDataInizio(dto.getDataInizio());
        periodo.setDataFine(dto.getDataFine());
        if (dto.getAttivo() != null) {
            periodo.setAttivo(dto.getAttivo());
        }

        PeriodoTariffario updated = periodoTariffarioRepository.save(periodo);
        return toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        PeriodoTariffario periodo = periodoTariffarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PeriodoTariffario", id));
        periodo.setAttivo(false);
        periodoTariffarioRepository.save(periodo);
    }

    private PeriodoTariffarioDTO toDTO(PeriodoTariffario entity) {
        return PeriodoTariffarioDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .dataInizio(entity.getDataInizio())
                .dataFine(entity.getDataFine())
                .attivo(entity.getAttivo())
                .build();
    }
}

