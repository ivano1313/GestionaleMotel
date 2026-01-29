package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.IncassoPerMetodoDTO;
import com.backend.gestionale_motel.dto.PagamentoReportDTO;
import com.backend.gestionale_motel.dto.ReportIncassiDTO;
import com.backend.gestionale_motel.entity.Pagamento;
import com.backend.gestionale_motel.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service per la generazione di report
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final PagamentoRepository pagamentoRepository;

    /**
     * Genera il report degli incassi per un periodo specificato
     * @param da data di inizio periodo
     * @param a data di fine periodo
     * @return report con totale, breakdown per metodo e lista pagamenti
     */
    public ReportIncassiDTO getReportIncassi(LocalDate da, LocalDate a) {
        LocalDateTime inizioPeriodo = da.atStartOfDay();
        LocalDateTime finePeriodo = a.plusDays(1).atStartOfDay();

        List<Pagamento> pagamenti = pagamentoRepository.findByDataPagamentoBetween(inizioPeriodo, finePeriodo);

        // Calcola totale
        BigDecimal totaleIncassi = pagamenti.stream()
                .map(Pagamento::getImporto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aggrega per metodo di pagamento
        Map<Long, List<Pagamento>> pagamentiPerMetodo = pagamenti.stream()
                .collect(Collectors.groupingBy(p -> p.getMetodoPagamento().getId()));

        List<IncassoPerMetodoDTO> incassiPerMetodo = pagamentiPerMetodo.entrySet().stream()
                .map(entry -> {
                    List<Pagamento> pagamentiMetodo = entry.getValue();
                    Pagamento primo = pagamentiMetodo.get(0);
                    BigDecimal totaleMetodo = pagamentiMetodo.stream()
                            .map(Pagamento::getImporto)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return IncassoPerMetodoDTO.builder()
                            .metodoId(entry.getKey())
                            .metodoNome(primo.getMetodoPagamento().getNome())
                            .totale(totaleMetodo)
                            .numeroPagamenti(pagamentiMetodo.size())
                            .build();
                })
                .sorted((a1, a2) -> a2.getTotale().compareTo(a1.getTotale()))
                .collect(Collectors.toList());

        // Converti pagamenti in DTO
        List<PagamentoReportDTO> pagamentiDTO = pagamenti.stream()
                .map(this::toPagamentoReportDTO)
                .sorted((p1, p2) -> p2.getData().compareTo(p1.getData()))
                .collect(Collectors.toList());

        return ReportIncassiDTO.builder()
                .dataDa(da)
                .dataA(a)
                .totaleIncassi(totaleIncassi)
                .incassiPerMetodo(incassiPerMetodo)
                .pagamenti(pagamentiDTO)
                .build();
    }

    /**
     * Converte un Pagamento entity in PagamentoReportDTO
     */
    private PagamentoReportDTO toPagamentoReportDTO(Pagamento pagamento) {
        String numeroCamera = pagamento.getPrenotazione().getCamera() != null
                ? pagamento.getPrenotazione().getCamera().getNumero()
                : "-";

        return PagamentoReportDTO.builder()
                .id(pagamento.getId())
                .data(pagamento.getDataPagamento())
                .importo(pagamento.getImporto())
                .metodo(pagamento.getMetodoPagamento().getNome())
                .camera(numeroCamera)
                .build();
    }
}
