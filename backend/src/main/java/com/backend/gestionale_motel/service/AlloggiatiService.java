package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.entity.*;
import com.backend.gestionale_motel.repository.OspitePrenotazioneRepository;
import com.backend.gestionale_motel.repository.PrenotazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service per la generazione del file TXT per il Portale Alloggiati Web
 * della Polizia di Stato italiana.
 *
 * Tracciato record: 168 caratteri per riga + CRLF
 */
@Service
@RequiredArgsConstructor
public class AlloggiatiService {

    private final PrenotazioneRepository prenotazioneRepository;
    private final OspitePrenotazioneRepository ospitePrenotazioneRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Codici Tipo Alloggiato
    private static final String TIPO_OSPITE_SINGOLO = "16";
    private static final String TIPO_CAPO_FAMIGLIA = "17";
    private static final String TIPO_CAPO_GRUPPO = "18";
    private static final String TIPO_FAMILIARE = "19";
    private static final String TIPO_MEMBRO_GRUPPO = "20";

    /**
     * Genera il file TXT per Alloggiati Web con gli arrivi di una specifica data.
     *
     * @param dataArrivo data di arrivo degli ospiti
     * @return contenuto del file TXT
     */
    @Transactional(readOnly = true)
    public String generaFileAlloggiati(LocalDate dataArrivo) {
        List<Prenotazione> prenotazioni = prenotazioneRepository
                .findByDataCheckinAndStatoIn(dataArrivo,
                        List.of(StatoPrenotazione.CONFERMATA, StatoPrenotazione.IN_CORSO));

        StringBuilder sb = new StringBuilder();

        for (Prenotazione prenotazione : prenotazioni) {
            List<OspitePrenotazione> ospiti = ospitePrenotazioneRepository
                    .findByPrenotazioneOrderByTitolareDesc(prenotazione);

            if (ospiti.isEmpty()) {
                continue;
            }

            int totaleOspiti = ospiti.size();
            boolean primoOspite = true;

            for (OspitePrenotazione op : ospiti) {
                String tipoAlloggiato = determinaTipoAlloggiato(op.getTitolare(), totaleOspiti, primoOspite);
                String riga = costruisciRiga(op.getOspite(), prenotazione, tipoAlloggiato);
                sb.append(riga);
                sb.append("\r\n");
                primoOspite = false;
            }
        }

        // Rimuovi ultimo CRLF se presente
        if (sb.length() >= 2) {
            sb.setLength(sb.length() - 2);
        }

        return sb.toString();
    }

    /**
     * Determina il tipo alloggiato secondo i codici del Portale Alloggiati.
     */
    private String determinaTipoAlloggiato(boolean titolare, int totaleOspiti, boolean primoOspite) {
        if (totaleOspiti == 1) {
            return TIPO_OSPITE_SINGOLO; // 16 - Ospite singolo
        }

        if (titolare || primoOspite) {
            // Per semplicità usiamo Capo Famiglia (17) per gruppi generici
            return TIPO_CAPO_FAMIGLIA; // 17 - Capo famiglia
        }

        return TIPO_FAMILIARE; // 19 - Familiare
    }

    /**
     * Costruisce una riga del tracciato record (168 caratteri).
     *
     * Tracciato:
     * Pos 1-2: Tipo Alloggiato (2)
     * Pos 3-12: Data Arrivo gg/mm/aaaa (10)
     * Pos 13-14: Giorni Permanenza (2)
     * Pos 15-64: Cognome (50)
     * Pos 65-94: Nome (30)
     * Pos 95: Sesso 1=M, 2=F (1)
     * Pos 96-105: Data Nascita (10)
     * Pos 106-114: Codice Comune Nascita (9)
     * Pos 115-116: Provincia Nascita (2)
     * Pos 117-125: Codice Stato Nascita (9)
     * Pos 126-134: Codice Cittadinanza (9)
     * Pos 135-139: Tipo Documento (5)
     * Pos 140-159: Numero Documento (20)
     * Pos 160-168: Codice Luogo Rilascio (9)
     */
    private String costruisciRiga(Ospite ospite, Prenotazione prenotazione, String tipoAlloggiato) {
        StringBuilder riga = new StringBuilder();

        // Tipo Alloggiato (2)
        riga.append(tipoAlloggiato);

        // Data Arrivo (10)
        riga.append(prenotazione.getDataCheckin().format(DATE_FORMAT));

        // Giorni Permanenza (2) - max 30
        long giorni = ChronoUnit.DAYS.between(prenotazione.getDataCheckin(), prenotazione.getDataCheckout());
        if (giorni > 30) giorni = 30;
        riga.append(padLeft(String.valueOf(giorni), 2));

        // Cognome (50)
        riga.append(padRight(normalizzaTesto(ospite.getCognome()), 50));

        // Nome (30)
        riga.append(padRight(normalizzaTesto(ospite.getNome()), 30));

        // Sesso (1) - 1=M, 2=F
        riga.append(ospite.getSesso() == Sesso.M ? "1" : "2");

        // Data Nascita (10)
        riga.append(ospite.getDataNascita().format(DATE_FORMAT));

        // Comune Nascita (9) + Provincia (2)
        if (ospite.getComuneNascita() != null) {
            riga.append(padRight(ospite.getComuneNascita().getCodice(), 9));
            riga.append(padRight(ospite.getComuneNascita().getProvincia(), 2));
        } else {
            riga.append(spaces(9)); // Comune vuoto se nato all'estero
            riga.append(spaces(2)); // Provincia vuota
        }

        // Stato Nascita (9)
        if (ospite.getStatoNascita() != null) {
            riga.append(padRight(ospite.getStatoNascita().getCodice(), 9));
        } else if (ospite.getComuneNascita() != null) {
            // Nato in Italia
            riga.append("100000100"); // Codice Italia
        } else {
            riga.append(spaces(9));
        }

        // Cittadinanza (9)
        riga.append(padRight(ospite.getCittadinanza().getCodice(), 9));

        // Campi documento - obbligatori solo per titolari (16, 17, 18)
        boolean richiedeDocumento = tipoAlloggiato.equals(TIPO_OSPITE_SINGOLO) ||
                                    tipoAlloggiato.equals(TIPO_CAPO_FAMIGLIA) ||
                                    tipoAlloggiato.equals(TIPO_CAPO_GRUPPO);

        if (richiedeDocumento) {
            // Tipo Documento (5)
            riga.append(padRight(ospite.getTipoDocumento().getSigla(), 5));

            // Numero Documento (20)
            riga.append(padRight(normalizzaTesto(ospite.getNumeroDocumento()), 20));

            // Luogo Rilascio (9) - codice comune o stato
            if (ospite.getComuneRilascio() != null) {
                riga.append(padRight(ospite.getComuneRilascio().getCodice(), 9));
            } else if (ospite.getStatoRilascio() != null) {
                riga.append(padRight(ospite.getStatoRilascio().getCodice(), 9));
            } else {
                riga.append(spaces(9));
            }
        } else {
            // Familiari/membri: 34 spazi
            riga.append(spaces(34));
        }

        return riga.toString();
    }

    /**
     * Normalizza il testo: maiuscolo, rimuove accenti e caratteri speciali.
     */
    private String normalizzaTesto(String testo) {
        if (testo == null) return "";
        return testo.toUpperCase()
                .replace("À", "A").replace("È", "E").replace("É", "E")
                .replace("Ì", "I").replace("Ò", "O").replace("Ù", "U")
                .replaceAll("[^A-Z0-9 ]", "");
    }

    /**
     * Padding a destra con spazi.
     */
    private String padRight(String s, int n) {
        if (s == null) s = "";
        if (s.length() > n) s = s.substring(0, n);
        return String.format("%-" + n + "s", s);
    }

    /**
     * Padding a sinistra con zeri.
     */
    private String padLeft(String s, int n) {
        if (s == null) s = "";
        if (s.length() > n) s = s.substring(0, n);
        return String.format("%" + n + "s", s).replace(' ', '0');
    }

    /**
     * Genera una stringa di n spazi.
     */
    private String spaces(int n) {
        return " ".repeat(n);
    }
}
