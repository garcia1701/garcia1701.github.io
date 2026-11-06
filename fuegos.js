/* Fuegos artificiales de celebración: inscripción oficial de la peña (Registro nº 0003062).
   Al entrar en la portada suben cohetes y, al explotar, escriben el mensaje.
   Se apagan solos al pasar la fecha FIN. Para quitarlos del todo, borra la línea
   <script src="fuegos.js" defer></script> del index.html (o este archivo). */
(function () {
  var FIN = new Date('2026-11-09T23:59:59+01:00');   // último día de fiesta
  if (new Date() > FIN && !window.FUEGOS_PRUEBA) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COLORES = ['#d4af37', '#ffd966', '#ffffff', '#c8102e', '#ff4d4d', '#ffb347'];
  var DURACION = 15000;

  var c = document.createElement('canvas'), x = c.getContext('2d');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:150;transition:opacity 1.5s';
  // Cielo de noche: oscurece la página solo mientras duran los fuegos
  var cielo = document.createElement('div');
  cielo.setAttribute('aria-hidden', 'true');
  cielo.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:149;opacity:0;transition:opacity 1.2s;' +
    'background:radial-gradient(ellipse at 50% 110%, rgba(70,0,10,.88), rgba(8,4,20,.9) 70%)';
  document.body.appendChild(cielo);
  document.body.appendChild(c);
  requestAnimationFrame(function () { cielo.style.opacity = '1'; });
  var W = innerWidth, H = innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  var movil = W < 700;

  // Frases: en móvil se parten en más líneas para que se lean bien
  var LINEAS = movil
    ? [['¡FELICIDADES!', '#ffd966'], ['YA SOMOS', '#ffffff'], ['OFICIALMENTE', '#ffffff'], ['PEÑA', '#ff4d4d']]
    : [['¡FELICIDADES!', '#ffd966'], ['YA SOMOS OFICIALMENTE PEÑA', '#ffffff']];

  // Convierte cada frase en una nube de puntos
  function puntosDe(txt, cy) {
    var o = document.createElement('canvas'), ox = o.getContext('2d');
    var tam = Math.min(movil ? 64 : 92, H * 0.11);
    ox.font = '900 ' + tam + 'px "Arial Black", Impact, "Helvetica Neue", Arial, sans-serif';
    var ancho = ox.measureText(txt).width;
    if (ancho > W * 0.9) { tam *= W * 0.9 / ancho; ox.font = '900 ' + tam + 'px "Arial Black", Impact, "Helvetica Neue", Arial, sans-serif'; ancho = ox.measureText(txt).width; }
    o.width = Math.ceil(ancho) + 4; o.height = Math.ceil(tam * 1.3);
    ox.font = '900 ' + tam + 'px "Arial Black", Impact, "Helvetica Neue", Arial, sans-serif'; ox.textBaseline = 'middle'; ox.fillStyle = '#000';
    ox.fillText(txt, 2, o.height / 2);
    var d = ox.getImageData(0, 0, o.width, o.height).data, paso = Math.max(3, Math.round(tam / 11)), pts = [];
    var x0 = (W - o.width) / 2, y0 = cy - o.height / 2;
    for (var j = 0; j < o.height; j += paso)
      for (var i = 0; i < o.width; i += paso)
        if (d[(j * o.width + i) * 4 + 3] > 128) pts.push([x0 + i, y0 + j]);
    return { pts: pts, alto: o.height };
  }
  var y = H * (movil ? 0.26 : 0.36), textos = [];
  LINEAS.forEach(function (l) {
    var r = puntosDe(l[0], y);
    textos.push({ pts: r.pts, col: l[1], cy: y });
    y += r.alto * 1.05;
  });

  var cohetes = [], chispas = [], letras = [], inicio = null, ultimo = 0, sigTexto = 0;
  var SUELTA = 11500; // cuándo se deshacen las letras

  function cohete(tx, ty, texto) {
    cohetes.push({ x: tx + (Math.random() - 0.5) * W * 0.15, y: H + 10, tx: tx, ty: ty, v: 9 + Math.random() * 2,
      col: COLORES[(Math.random() * COLORES.length) | 0], texto: texto });
  }
  function explotar(r) {
    var n = r.texto ? 40 : (movil ? 45 : 80), col2 = COLORES[(Math.random() * COLORES.length) | 0];
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n, s = 2 + Math.random() * 3.5;
      chispas.push({ x: r.x, y: r.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vida: 1, col: Math.random() < 0.5 ? r.col : col2, brilla: Math.random() < 0.3 });
    }
    if (r.texto) r.texto.pts.forEach(function (p) {
      letras.push({ x: r.x, y: r.y, tx: p[0], ty: p[1], vx: 0, vy: 0, col: r.texto.col, suelta: false, vida: 1,
        k: 0.06 + Math.random() * 0.05 });
    });
  }

  function paso(t) {
    if (inicio === null) inicio = t;
    var e = t - inicio, activo = e < DURACION;

    // cohetes sueltos de ambiente
    if (activo && t - ultimo > (movil ? 750 : 500)) {
      cohete(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.5)); ultimo = t;
    }
    // cohetes que escriben el mensaje, uno por línea
    if (sigTexto < textos.length && e > 1200 + sigTexto * 1300) {
      cohete(W / 2, textos[sigTexto].cy, textos[sigTexto]); sigTexto++;
    }
    if (e > SUELTA) letras.forEach(function (l) {
      if (!l.suelta) { l.suelta = true; l.vx = (Math.random() - 0.5) * 2; l.vy = Math.random() * -1.5; }
    });

    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter';

    for (var i = cohetes.length - 1; i >= 0; i--) {
      var r = cohetes[i], dx = r.tx - r.x, dy = r.ty - r.y, d = Math.hypot(dx, dy);
      if (d < r.v) { explotar(r); cohetes.splice(i, 1); continue; }
      r.x += dx / d * r.v; r.y += dy / d * r.v;
      x.fillStyle = '#ffe9a8'; x.beginPath(); x.arc(r.x, r.y, r.texto ? 3 : 2, 0, 7); x.fill();
    }
    for (i = chispas.length - 1; i >= 0; i--) {
      var p = chispas[i];
      p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.05; p.x += p.vx; p.y += p.vy; p.vida -= 0.012;
      if (p.vida <= 0) { chispas.splice(i, 1); continue; }
      x.globalAlpha = p.brilla && Math.random() < 0.3 ? 0.2 : p.vida;
      x.fillStyle = p.col; x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 7); x.fill();
    }
    var rad = movil ? 1.8 : 2.6;
    for (i = letras.length - 1; i >= 0; i--) {
      var l = letras[i];
      if (!l.suelta) { l.x += (l.tx - l.x) * l.k; l.y += (l.ty - l.y) * l.k; x.globalAlpha = Math.random() < 0.06 ? 0.4 : 1; }
      else { l.vy += 0.06; l.x += l.vx; l.y += l.vy; l.vida -= 0.012; if (l.vida <= 0) { letras.splice(i, 1); continue; } x.globalAlpha = l.vida; }
      x.fillStyle = l.col; x.beginPath(); x.arc(l.x, l.y, rad, 0, 7); x.fill();
    }
    x.globalAlpha = 1;

    if (!activo && cielo.style.opacity === '1') cielo.style.opacity = '0';
    if (activo || cohetes.length || chispas.length || letras.length) requestAnimationFrame(paso);
    else { c.style.opacity = '0'; setTimeout(function () { c.remove(); cielo.remove(); }, 1600); }
  }
  requestAnimationFrame(paso);
})();
