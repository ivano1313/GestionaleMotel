package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.MetodoPagamentoDTO;
import com.backend.gestionale_motel.entity.MetodoPagamento;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.MetodoPagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetodoPagamentoService {

    private final MetodoPagamentoRepository metodoPagamentoRepository;

    public List<MetodoPagamentoDTO> findAll() {
        return metodoPagamentoRepository.findByAttivo(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MetodoPagamentoDTO findById(Long id) {
        MetodoPagamento metodo = metodoPagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MetodoPagamento", id));
        return toDTO(metodo);
    }

    @Transactional
    public MetodoPagamentoDTO create(MetodoPagamentoDTO dto) {
        MetodoPagamento metodo = MetodoPagamento.builder()
                .nome(dto.getNome())
                .attivo(dto.getAttivo() != null ? dto.getAttivo() : true)
                .build();

        MetodoPagamento saved = metodoPagamentoRepository.save(metodo);
        return toDTO(saved);
    }

    @Transactional
    public MetodoPagamentoDTO update(Long id, MetodoPagamentoDTO dto) {
        MetodoPagamento metodo = metodoPagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MetodoPagamento", id));

        metodo.setNome(dto.getNome());
        if (dto.getAttivo() != null) {
            metodo.setAttivo(dto.getAttivo());
        }

        MetodoPagamento updated = metodoPagamentoRepository.save(metodo);
        return toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        MetodoPagamento metodo = metodoPagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MetodoPagamento", id));
        metodo.setAttivo(false);
        metodoPagamentoRepository.save(metodo);
    }

    private MetodoPagamentoDTO toDTO(MetodoPagamento entity) {
        return MetodoPagamentoDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .attivo(entity.getAttivo())
                .build();
    }
}

