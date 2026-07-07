/* ============================
   EVENTOS — Peña Taurina Peguerinos
   Cada evento desaparece de "Próximas Citas"
   2 horas después de su inicio (campo "fin")
============================ */

const AVISO_PENA = "Todos los socios asistentes deberán acudir con la equipación y el pañuelo de la Peña. ¡Viva España y vivan los toros!";

const EVENTOS_DATA = [
    // ---- Eventos anteriores (ya pasados, no se muestran) ----
    {
        titulo: "Feria de Fallas 2026 — Retransmisión en la sede",
        fecha: new Date(2026, 2, 17, 18, 0),
        fin:   new Date(2026, 2, 17, 20, 0),
        lugar: "Bar Reste El Risco del Águila",
        descripcion: "Retransmisión en directo. Toros de Santiago Domecq. Cartel: Perera, Hernández y Marco Pérez."
    },
    {
        titulo: "Cena de la Peña",
        fecha: new Date(2026, 2, 25, 21, 0),
        fin:   new Date(2026, 2, 25, 23, 0),
        lugar: "Restaurante Risco del Águila",
        descripcion: "Cena de convivencia para todos los socios y simpatizantes."
    },

    // ---- San Fermín 2026 ----
    {
        titulo: "Corrida de Toros — San Fermín 2026 (retransmisión en la sede)",
        fecha: new Date(2026, 6, 11, 18, 30),        // sábado 11 julio — 18:30
        fin:   new Date(2026, 6, 11, 20, 30),        // se retira a las 2 horas
        lugar: "Sede de la Peña",
        ganaderia: "José Escolar",
        descripcion: "Cartel: Antonio Ferrera, Juan de Castilla e Isaac Fonseca.",
        destacado: AVISO_PENA
    },
    {
        titulo: "Quedada — Encierro de San Fermín",
        fecha: new Date(2026, 6, 12, 7, 45),         // domingo 12 julio — 7:45
        fin:   new Date(2026, 6, 12, 9, 45),
        lugar: "Sede de la Peña",
        ganaderia: "La Palmosilla",
        descripcion: "Quedada para ver juntos el encierro (suelta a las 8:00).",
        destacado: AVISO_PENA
    },
    {
        titulo: "Corrida de Toros — San Fermín 2026 (retransmisión en la sede)",
        fecha: new Date(2026, 6, 12, 18, 30),        // domingo 12 julio — 18:30
        fin:   new Date(2026, 6, 12, 20, 30),
        lugar: "Sede de la Peña",
        ganaderia: "La Palmosilla",
        descripcion: "Cartel: Fortes, Fernando Adrián y Samuel Navalón.",
        destacado: AVISO_PENA
    }
];
