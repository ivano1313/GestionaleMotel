package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.CategoriaSpesaDTO;
import com.backend.gestionale_motel.entity.CategoriaSpesa;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.CategoriaSpesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaSpesaService {

    private final CategoriaSpesaRepository categoriaSpesaRepository;

    public List<CategoriaSpesaDTO> findAll() {
        return categoriaSpesaRepository.findByAttivo(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoriaSpesaDTO findById(Long id) {
        CategoriaSpesa categoria = categoriaSpesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", id));
        return toDTO(categoria);
    }

    @Transactional
    public CategoriaSpesaDTO create(CategoriaSpesaDTO dto) {
        CategoriaSpesa categoria = CategoriaSpesa.builder()
                .nome(dto.getNome())
                .descrizione(dto.getDescrizione())
                .attivo(dto.getAttivo() != null ? dto.getAttivo() : true)
                .build();

        CategoriaSpesa saved = categoriaSpesaRepository.save(categoria);
        return toDTO(saved);
    }

    @Transactional
    public CategoriaSpesaDTO update(Long id, CategoriaSpesaDTO dto) {
        CategoriaSpesa categoria = categoriaSpesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", id));

        categoria.setNome(dto.getNome());
        categoria.setDescrizione(dto.getDescrizione());
        if (dto.getAttivo() != null) {
            categoria.setAttivo(dto.getAttivo());
        }

        CategoriaSpesa updated = categoriaSpesaRepository.save(categoria);
        return toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        CategoriaSpesa categoria = categoriaSpesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", id));
        categoria.setAttivo(false);
        categoriaSpesaRepository.save(categoria);
    }

    private CategoriaSpesaDTO toDTO(CategoriaSpesa entity) {
        return CategoriaSpesaDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .descrizione(entity.getDescrizione())
                .attivo(entity.getAttivo())
                .build();
    }
}
