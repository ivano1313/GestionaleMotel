package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.BilancioDTO;
import com.backend.gestionale_motel.dto.IncassoPerMetodoDTO;
import com.backend.gestionale_motel.dto.PagamentoReportDTO;
import com.backend.gestionale_motel.dto.ReportIncassiDTO;
import com.backend.gestionale_motel.dto.UscitaPerCategoriaDTO;
import com.backend.gestionale_motel.entity.Pagamento;
import com.backend.gestionale_motel.entity.Spesa;
import com.backend.gestionale_motel.repository.PagamentoRepository;
import com.backend.gestionale_motel.repository.SpesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
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
    private final SpesaRepository spesaRepository;

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

    /**
     * Genera il bilancio entrate/uscite per un periodo specificato
     * @param da data di inizio periodo
     * @param a data di fine periodo
     * @return bilancio con totale entrate, uscite, saldo e breakdown
     */
    public BilancioDTO getBilancio(LocalDate da, LocalDate a) {
        // Calcola entrate (pagamenti)
        LocalDateTime inizioPeriodo = da.atStartOfDay();
        LocalDateTime finePeriodo = a.plusDays(1).atStartOfDay();

        List<Pagamento> pagamenti = pagamentoRepository.findByDataPagamentoBetween(inizioPeriodo, finePeriodo);

        BigDecimal totaleEntrate = pagamenti.stream()
                .map(Pagamento::getImporto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aggrega entrate per metodo di pagamento
        Map<Long, List<Pagamento>> pagamentiPerMetodo = pagamenti.stream()
                .collect(Collectors.groupingBy(p -> p.getMetodoPagamento().getId()));

        List<IncassoPerMetodoDTO> entratePerMetodo = pagamentiPerMetodo.entrySet().stream()
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

        // Calcola uscite (spese)
        List<Spesa> spese = spesaRepository.findByDataSpesaBetweenAndAttivoTrueOrderByDataSpesaDesc(da, a);

        BigDecimal totaleUscite = spese.stream()
                .map(Spesa::getImporto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aggrega uscite per categoria
        Map<Long, List<Spesa>> spesePerCategoria = spese.stream()
                .collect(Collectors.groupingBy(s -> s.getCategoria().getId()));

        List<UscitaPerCategoriaDTO> uscitePerCategoria = spesePerCategoria.entrySet().stream()
                .map(entry -> {
                    List<Spesa> speseCategoria = entry.getValue();
                    Spesa prima = speseCategoria.get(0);
                    BigDecimal totaleCategoria = speseCategoria.stream()
                            .map(Spesa::getImporto)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return UscitaPerCategoriaDTO.builder()
                            .categoriaId(entry.getKey())
                            .categoriaNome(prima.getCategoria().getNome())
                            .totale(totaleCategoria)
                            .numeroSpese(speseCategoria.size())
                            .build();
                })
                .sorted((u1, u2) -> u2.getTotale().compareTo(u1.getTotale()))
                .collect(Collectors.toList());

        // Calcola saldo
        BigDecimal saldo = totaleEntrate.subtract(totaleUscite);

        return BilancioDTO.builder()
                .dataDa(da)
                .dataA(a)
                .totaleEntrate(totaleEntrate)
                .totaleUscite(totaleUscite)
                .saldo(saldo)
                .entratePerMetodo(entratePerMetodo)
                .uscitePerCategoria(uscitePerCategoria)
                .build();
    }

    /**
     * Esporta i movimenti (entrate e uscite) in formato CSV
     * @param da data di inizio periodo
     * @param a data di fine periodo
     * @return stringa CSV con tutti i movimenti
     */
    public String exportMovimentiCsv(LocalDate da, LocalDate a) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        StringBuilder csv = new StringBuilder();

        // Header
        csv.append("Data;Tipo;Categoria;Descrizione;Importo;Note\n");

        // Lista movimenti unificata
        List<MovimentoCsv> movimenti = new ArrayList<>();

        // Aggiungi entrate (pagamenti)
        LocalDateTime inizioPeriodo = da.atStartOfDay();
        LocalDateTime finePeriodo = a.plusDays(1).atStartOfDay();
        List<Pagamento> pagamenti = pagamentoRepository.findByDataPagamentoBetween(inizioPeriodo, finePeriodo);

        for (Pagamento p : pagamenti) {
            String camera = p.getPrenotazione().getCamera() != null
                    ? p.getPrenotazione().getCamera().getNumero()
                    : "-";
            String descrizione = "Pagamento camera " + camera;

            movimenti.add(new MovimentoCsv(
                    p.getDataPagamento().toLocalDate(),
                    p.getDataPagamento().format(dateTimeFormatter),
                    "ENTRATA",
                    p.getMetodoPagamento().getNome(),
                    descrizione,
                    p.getImporto(),
                    ""
            ));
        }

        // Aggiungi uscite (spese)
        List<Spesa> spese = spesaRepository.findByDataSpesaBetweenAndAttivoTrueOrderByDataSpesaDesc(da, a);

        for (Spesa s : spese) {
            movimenti.add(new MovimentoCsv(
                    s.getDataSpesa(),
                    s.getDataSpesa().format(dateFormatter),
                    "USCITA",
                    s.getCategoria().getNome(),
                    s.getDescrizione(),
                    s.getImporto().negate(),
                    s.getNote() != null ? s.getNote() : ""
            ));
        }

        // Ordina per data
        movimenti.sort(Comparator.comparing(MovimentoCsv::data));

        // Scrivi righe CSV
        for (MovimentoCsv m : movimenti) {
            csv.append(escapeCsv(m.dataFormattata())).append(";");
            csv.append(escapeCsv(m.tipo())).append(";");
            csv.append(escapeCsv(m.categoria())).append(";");
            csv.append(escapeCsv(m.descrizione())).append(";");
            csv.append(m.importo().toString().replace(".", ",")).append(";");
            csv.append(escapeCsv(m.note())).append("\n");
        }

        // Aggiungi riga totali
        BigDecimal totaleEntrate = movimenti.stream()
                .filter(m -> "ENTRATA".equals(m.tipo()))
                .map(MovimentoCsv::importo)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totaleUscite = movimenti.stream()
                .filter(m -> "USCITA".equals(m.tipo()))
                .map(m -> m.importo().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldo = totaleEntrate.subtract(totaleUscite);

        csv.append("\n");
        csv.append(";;TOTALE ENTRATE;;").append(totaleEntrate.toString().replace(".", ",")).append(";\n");
        csv.append(";;TOTALE USCITE;;-").append(totaleUscite.toString().replace(".", ",")).append(";\n");
        csv.append(";;SALDO;;").append(saldo.toString().replace(".", ",")).append(";\n");

        return csv.toString();
    }

    /**
     * Escape per valori CSV (gestisce punto e virgola e virgolette)
     */
    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(";") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    /**
     * Record per rappresentare un movimento nel CSV
     */
    private record MovimentoCsv(
            LocalDate data,
            String dataFormattata,
            String tipo,
            String categoria,
            String descrizione,
            BigDecimal importo,
            String note
    ) {}
}
