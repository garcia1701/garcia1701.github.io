// Base de datos de eventos de la Peña
const EVENTOS_DATA = [
    {
        id: 1,
        titulo: "Reunión Inaugural",
        fecha: new Date(2026, 2, 12, 21, 0),
        lugar: "Bar Reste El Risco del Águila",
        descripcion: "Primera reunión oficial, presentación y firma de estatutos.",
        destacado: ""
    },
    {
        id: 2,
        titulo: "Feria de Fallas 2026",
        fecha: new Date(2026, 2, 17, 17, 0),
        lugar: "Bar Restaurante El Risco del Águila",
        descripcion: "Retransmisión en directo. Toros de Santiago Domecq.",
        destacado: ""
    },
    {
        id: 3,
        titulo: "Cena de la Peña",
        fecha: new Date(2026, 2, 25, 21, 0),
        lugar: "Restaurante Risco del Águila",
        descripcion: "Cena de convivencia para socios y simpatizantes.",
        destacado: ""
    },
    {
        id: 4,
        titulo: "Domingo de Resurrección",
        fecha: new Date(2026, 3, 5, 18, 30),
        lugar: "Feria de Abril (Sevilla) - Risco del Águila",
        descripcion: "Retransmisión en directo.",
        destacado: "Morante de la Puebla · Roca Rey · David de Miranda — Toros de Garcigrande"
    },
    {
        id: 5,
        titulo: "Corrida de Toros — Feria de Abril",
        fecha: new Date(2026, 3, 12, 18, 30),
        lugar: "Real Maestranza de Sevilla — Retransmisión en Risco del Águila",
        descripcion: "Tercera de Abono. Retransmisión en directo en nuestra sede.",
        destacado: "Lorenzo · Serna · Molina — Toros de Fuente Ymbro"
    },
    {
        id: 6,
        titulo: "Cena de la Peña",
        fecha: new Date(2026, 3, 15, 21, 0),
        fin: new Date(2026, 3, 15, 22, 0),
        lugar: "Restaurante Risco del Águila",
        descripcion: "Cena de convivencia para socios y simpatizantes.",
        destacado: ""
    },
    {
        id: 7,
        titulo: "Copa Chenel — San Martín de Valdeiglesias",
        fecha: new Date(2026, 5, 27, 17, 0),
        fin: new Date(2026, 5, 27, 21, 0),
        lugar: "San Martín de Valdeiglesias (Madrid)",
        ganaderia: "Castillejo de Huebra y Adolfo Martín",
        descripcion: "La Peña Taurina Peguerinos está valorando organizar un grupo de socios para asistir juntos. En función del número de participantes, se estudiarán formas de apoyo económico con criterios transparentes y equilibrados para todos.",
        destacado: "Confirmá tu interés antes del 14 de mayo",
        confirmacion: true,
        fechaLimiteConfirmacion: new Date(2026, 4, 14, 23, 59)
    },
    {
        id: 8,
        titulo: "Corrida de Toros — Ávila 2026",
        fecha: new Date(2026, 5, 20, 19, 0),
        fin: new Date(2026, 5, 20, 21, 0),
        lugar: "Plaza de Toros de Ávila",
        ganaderia: "Pallarés",
        descripcion: "6 toros de la ganadería Pallarés. Organiza: Tauroemoción.",
        destacado: "Talavante · Emilio de Justo · David de Miranda — 🎟️ Descuento venta anticipada hasta el 7 de junio · tauroemocion.com · 613 611 758",
        confirmacion: false
    }
];
