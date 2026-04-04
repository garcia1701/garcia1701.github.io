/* ============================
   AVISO EMERGENTE PARA SOCIOS
   Cierra el modal cuando el socio confirma
============================ */

function cerrarAviso() {
    const modal = document.getElementById("modal-aviso");
    if (modal) {
        modal.style.display = "none";
    }
}
