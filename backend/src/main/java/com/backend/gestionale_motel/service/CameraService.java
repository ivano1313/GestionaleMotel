package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.CameraDTO;
import com.backend.gestionale_motel.entity.Camera;
import com.backend.gestionale_motel.entity.StatoPulizia;
import com.backend.gestionale_motel.entity.TipologiaCamera;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.CameraRepository;
import com.backend.gestionale_motel.repository.TipologiaCameraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CameraService {

    private final CameraRepository cameraRepository;
    private final TipologiaCameraRepository tipologiaCameraRepository;

    public List<CameraDTO> findAll() {
        return cameraRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CameraDTO findById(Long id) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Camera", id));
        return toDTO(camera);
    }

    public List<CameraDTO> findDisponibili(LocalDate checkIn, LocalDate checkOut) {
        return cameraRepository.findCamereDisponibili(checkIn, checkOut).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CameraDTO> findDaPulire() {
        return cameraRepository.findByStatoPulizia(StatoPulizia.DA_PULIRE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CameraDTO cambiaStatoPulizia(Long id, StatoPulizia stato) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Camera", id));

        camera.setStatoPulizia(stato);
        Camera updated = cameraRepository.save(camera);
        return toDTO(updated);
    }

    @Transactional
    public CameraDTO create(CameraDTO dto) {
        TipologiaCamera tipologia = tipologiaCameraRepository.findById(dto.getTipologiaId())
                .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", dto.getTipologiaId()));

        Camera camera = Camera.builder()
                .numero(dto.getNumero())
                .statoPulizia(dto.getStatoPulizia() != null ? dto.getStatoPulizia() : StatoPulizia.PULITA)
                .tipologia(tipologia)
                .attivo(true)
                .build();

        Camera saved = cameraRepository.save(camera);
        return toDTO(saved);
    }

    @Transactional
    public CameraDTO update(Long id, CameraDTO dto) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Camera", id));

        if (dto.getTipologiaId() != null) {
            TipologiaCamera tipologia = tipologiaCameraRepository.findById(dto.getTipologiaId())
                    .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", dto.getTipologiaId()));
            camera.setTipologia(tipologia);
        }

        camera.setNumero(dto.getNumero());
        if (dto.getStatoPulizia() != null) {
            camera.setStatoPulizia(dto.getStatoPulizia());
        }

        Camera updated = cameraRepository.save(camera);
        return toDTO(updated);
    }

    private CameraDTO toDTO(Camera entity) {
        return CameraDTO.builder()
                .id(entity.getId())
                .numero(entity.getNumero())
                .statoPulizia(entity.getStatoPulizia())
                .tipologiaId(entity.getTipologia().getId())
                .tipologiaNome(entity.getTipologia().getNome())
                .build();
    }
}

