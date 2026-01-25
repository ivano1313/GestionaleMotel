package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.OspiteDTO;
import com.backend.gestionale_motel.entity.*;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OspiteService {

    private final OspiteRepository ospiteRepository;
    private final ComuneRepository comuneRepository;
    private final StatoRepository statoRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;

    public List<OspiteDTO> findAll() {
        return ospiteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OspiteDTO findById(Long id) {
        Ospite ospite = ospiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ospite", id));
        return toDTO(ospite);
    }

    public List<OspiteDTO> search(String termine) {
        return ospiteRepository.searchByTermine(termine).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OspiteDTO> findDuplicati(String nome, String cognome, String documento) {
        return ospiteRepository.findOspitiSimili(nome, cognome, documento).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OspiteDTO create(OspiteDTO dto) {
        Ospite ospite = Ospite.builder()
                .cognome(dto.getCognome())
                .nome(dto.getNome())
                .sesso(dto.getSesso())
                .dataNascita(dto.getDataNascita())
                .numeroDocumento(dto.getNumeroDocumento())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .attivo(true)
                .build();

        // Cittadinanza (obbligatoria)
        if (dto.getCittadinanzaId() != null) {
            Stato cittadinanza = statoRepository.findById(dto.getCittadinanzaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stato", dto.getCittadinanzaId()));
            ospite.setCittadinanza(cittadinanza);
        }

        // Tipo documento (obbligatorio)
        if (dto.getTipoDocumentoId() != null) {
            TipoDocumento tipoDoc = tipoDocumentoRepository.findById(dto.getTipoDocumentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("TipoDocumento", dto.getTipoDocumentoId()));
            ospite.setTipoDocumento(tipoDoc);
        }

        // Comune nascita (opzionale - XOR con stato nascita)
        if (dto.getComuneNascitaId() != null) {
            Comune comune = comuneRepository.findById(dto.getComuneNascitaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comune", dto.getComuneNascitaId()));
            ospite.setComuneNascita(comune);
        }

        // Stato nascita (opzionale - XOR con comune nascita)
        if (dto.getStatoNascitaId() != null) {
            Stato stato = statoRepository.findById(dto.getStatoNascitaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stato", dto.getStatoNascitaId()));
            ospite.setStatoNascita(stato);
        }

        // Comune rilascio documento (opzionale - XOR con stato rilascio)
        if (dto.getComuneRilascioId() != null) {
            Comune comune = comuneRepository.findById(dto.getComuneRilascioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comune", dto.getComuneRilascioId()));
            ospite.setComuneRilascio(comune);
        }

        // Stato rilascio documento (opzionale - XOR con comune rilascio)
        if (dto.getStatoRilascioId() != null) {
            Stato stato = statoRepository.findById(dto.getStatoRilascioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stato", dto.getStatoRilascioId()));
            ospite.setStatoRilascio(stato);
        }

        Ospite saved = ospiteRepository.save(ospite);
        return toDTO(saved);
    }

    @Transactional
    public OspiteDTO update(Long id, OspiteDTO dto) {
        Ospite ospite = ospiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ospite", id));

        ospite.setCognome(dto.getCognome());
        ospite.setNome(dto.getNome());
        ospite.setSesso(dto.getSesso());
        ospite.setDataNascita(dto.getDataNascita());
        ospite.setNumeroDocumento(dto.getNumeroDocumento());
        ospite.setTelefono(dto.getTelefono());
        ospite.setEmail(dto.getEmail());

        // Aggiorna le relazioni se fornite
        if (dto.getCittadinanzaId() != null) {
            Stato cittadinanza = statoRepository.findById(dto.getCittadinanzaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stato", dto.getCittadinanzaId()));
            ospite.setCittadinanza(cittadinanza);
        }

        if (dto.getTipoDocumentoId() != null) {
            TipoDocumento tipoDoc = tipoDocumentoRepository.findById(dto.getTipoDocumentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("TipoDocumento", dto.getTipoDocumentoId()));
            ospite.setTipoDocumento(tipoDoc);
        }

        if (dto.getComuneNascitaId() != null) {
            Comune comune = comuneRepository.findById(dto.getComuneNascitaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comune", dto.getComuneNascitaId()));
            ospite.setComuneNascita(comune);
        }

        if (dto.getStatoNascitaId() != null) {
            Stato stato = statoRepository.findById(dto.getStatoNascitaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stato", dto.getStatoNascitaId()));
            ospite.setStatoNascita(stato);
        }

        // Gestione XOR per luogo rilascio - resetta se necessario
        if (dto.getComuneRilascioId() != null) {
            Comune comune = comuneRepository.findById(dto.getComuneRilascioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comune", dto.getComuneRilascioId()));
            ospite.setComuneRilascio(comune);
            ospite.setStatoRilascio(null);
        } else if (dto.getStatoRilascioId() != null) {
            Stato stato = statoRepository.findById(dto.getStatoRilascioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Stato", dto.getStatoRilascioId()));
            ospite.setStatoRilascio(stato);
            ospite.setComuneRilascio(null);
        }

        Ospite updated = ospiteRepository.save(ospite);
        return toDTO(updated);
    }

    private OspiteDTO toDTO(Ospite entity) {
        OspiteDTO.OspiteDTOBuilder builder = OspiteDTO.builder()
                .id(entity.getId())
                .cognome(entity.getCognome())
                .nome(entity.getNome())
                .sesso(entity.getSesso())
                .dataNascita(entity.getDataNascita())
                .numeroDocumento(entity.getNumeroDocumento())
                .telefono(entity.getTelefono())
                .email(entity.getEmail());

        // Aggiungi i dati delle relazioni se presenti
        if (entity.getComuneNascita() != null) {
            builder.comuneNascitaId(entity.getComuneNascita().getId())
                   .comuneNascitaNome(entity.getComuneNascita().getNome());
        }

        if (entity.getStatoNascita() != null) {
            builder.statoNascitaId(entity.getStatoNascita().getId())
                   .statoNascitaNome(entity.getStatoNascita().getNome());
        }

        if (entity.getComuneRilascio() != null) {
            builder.comuneRilascioId(entity.getComuneRilascio().getId())
                   .comuneRilascioNome(entity.getComuneRilascio().getNome());
        }

        if (entity.getStatoRilascio() != null) {
            builder.statoRilascioId(entity.getStatoRilascio().getId())
                   .statoRilascioNome(entity.getStatoRilascio().getNome());
        }

        if (entity.getCittadinanza() != null) {
            builder.cittadinanzaId(entity.getCittadinanza().getId())
                   .cittadinanzaNome(entity.getCittadinanza().getNome());
        }

        if (entity.getTipoDocumento() != null) {
            builder.tipoDocumentoId(entity.getTipoDocumento().getId())
                   .tipoDocumentoSigla(entity.getTipoDocumento().getSigla());
        }

        return builder.build();
    }
}

