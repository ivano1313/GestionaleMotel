package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.PagamentoDTO;
import com.backend.gestionale_motel.entity.MetodoPagamento;
import com.backend.gestionale_motel.entity.Pagamento;
import com.backend.gestionale_motel.entity.Prenotazione;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.MetodoPagamentoRepository;
import com.backend.gestionale_motel.repository.PagamentoRepository;
import com.backend.gestionale_motel.repository.PrenotazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final PrenotazioneRepository prenotazioneRepository;
    private final MetodoPagamentoRepository metodoPagamentoRepository;

    public List<PagamentoDTO> findByPrenotazione(Long prenotazioneId) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        return pagamentoRepository.findByPrenotazione(prenotazione).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalePagato(Long prenotazioneId) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        return pagamentoRepository.sumImportoByPrenotazione(prenotazione);
    }

    public BigDecimal getSaldoDovuto(Long prenotazioneId) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        BigDecimal prezzoTotale = prenotazione.getPrezzoTotale();
        BigDecimal totalePagato = getTotalePagato(prenotazioneId);

        return prezzoTotale.subtract(totalePagato);
    }

    @Transactional
    public PagamentoDTO create(PagamentoDTO dto) {
        Prenotazione prenotazione = prenotazioneRepository.findById(dto.getPrenotazioneId())
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", dto.getPrenotazioneId()));

        MetodoPagamento metodo = metodoPagamentoRepository.findById(dto.getMetodoPagamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("MetodoPagamento", dto.getMetodoPagamentoId()));

        Pagamento pagamento = Pagamento.builder()
                .prenotazione(prenotazione)
                .metodoPagamento(metodo)
                .importo(dto.getImporto())
                .build();

        Pagamento saved = pagamentoRepository.save(pagamento);
        return toDTO(saved);
    }

    private PagamentoDTO toDTO(Pagamento entity) {
        return PagamentoDTO.builder()
                .id(entity.getId())
                .prenotazioneId(entity.getPrenotazione().getId())
                .metodoPagamentoId(entity.getMetodoPagamento().getId())
                .metodoPagamentoNome(entity.getMetodoPagamento().getNome())
                .importo(entity.getImporto())
                .dataPagamento(entity.getDataPagamento())
                .build();
    }
}

