/* ============================
   EVENTO AUTOMÁTICO
   Oculta el evento cuando pasa la fecha
============================ */

const fechaEvento = new Date(2026, 3, 12, 18, 30); // 12 abril 2026 – 18:30
const ahora = new Date();

const cartel = document.getElementById("evento-resurreccion");
const mensaje = document.getElementById("mensaje-por-defecto");

if (cartel && mensaje) {
    if (ahora > fechaEvento) {
        cartel.style.display = "none";
        mensaje.style.display = "block";
    }
}
