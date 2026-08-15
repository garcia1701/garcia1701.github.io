/* ============================
   EVENTOS — Peña Taurina Peguerinos
   Cada evento desaparece de "Próximas Citas"
   2 horas después de su inicio (campo "fin")
============================ */

const AVISO_PENA = "Todos los socios asistentes deberán acudir con la equipación y el pañuelo de la Peña.";

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
    },
    // ---- Gran Final Copa Chenel (retransmisión en la sede) ----
    {
        titulo: "Gran Final de la Copa Chenel (retransmisión en la sede)",
        fecha: new Date(2026, 6, 30, 21, 0),          // jueves 30 julio — 21:00
        fin:   new Date(2026, 6, 30, 22, 0),          // a las 22:00 pasa al historial
        lugar: "Sede de la Peña",
        ganaderia: "El Capea y Carmen Lorenzo",
        descripcion: "Nos reunimos en la sede para ver juntos la gran final de la Copa Chenel, desde la Plaza de Toros de Las Ventas (Madrid), en directo por Telemadrid. Terna: Alejandro Marcos, Héctor Gutiérrez (que confirma su alternativa) y Manuel Diosleguarde.",
        destacado: AVISO_PENA
    },

    // ---- Fiestas de Peguerinos 2026 — TORO DE FUEGO ----
    {
        titulo: "🔥 Toro de Fuego de la Peña — Fiestas de Peguerinos",
        fecha: new Date(2026, 7, 16, 0, 0),     // medianoche de esta noche (00:00)
        fin:   new Date(2026, 7, 16, 2, 0),      // a las 02:00 de la madrugada se va al historial
        lugar: "Calles de Peguerinos — Fiestas del pueblo",
        descripcion: "¡Esta noche arde la fiesta! Este año la Peña ha puesto su granito, así que el toro de fuego se dará también una vuelta para nosotros.",
        destacado: "🐂🔥 Ponte la camiseta y el pañuelo de la Peña y a correr delante del toro de fuego… ¡pero sin chamuscarse! El que no corra, que anime bien fuerte."
    },

    // ---- Feria de la Virgen de San Lorenzo 2026 — VIAJE A VALLADOLID ----
    {
        id: 1,
        titulo: "Viaje a la corrida de toros — Valladolid (Victorino Martín)",
        fecha: new Date(2026, 8, 12, 18, 0),          // sábado 12 septiembre — 18:00
        fin:   new Date(2026, 8, 1, 23, 59),          // el 2 de septiembre pasa al historial
        lugar: "Plaza de Toros de Valladolid (Coso del Paseo de Zorrilla)",
        ganaderia: "Victorino Martín",
        descripcion: "Salida en grupo de la peña a la Feria de la Virgen de San Lorenzo. Cartel: Manuel Escribano, Daniel Luque y Aarón Palacio. Según lo acordado en el Acta nº 2 (12/07/2026): la entrada la abona cada asistente y el transporte lo sufragan los fondos de la peña.",
        destacado: "⚠️ Plazo para apuntarse: hasta el 1 de septiembre. " + AVISO_PENA,
        confirmacion: true,
        fechaLimiteConfirmacion: new Date(2026, 8, 1, 23, 59)  // cierra Me apunto / No voy el 1-sep a las 23:59
    }
];
