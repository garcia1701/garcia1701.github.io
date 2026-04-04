/* ============================
   CONTADOR DE VISITAS DISCRETO
   Registra visitas sin mostrar nada
============================ */

fetch("https://api.countapi.xyz/hit/pegueraytaurina/visitas")
  .then(r => r.json())
  .then(d => console.log("Visitas totales:", d.value));
