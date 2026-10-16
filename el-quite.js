/* =========================================================
   EL QUITE · juego de la Peña Taurina Peguerinos
   Se abre en una ventana encima de la página (no cambia nada de ella).
   Uso: <script src="el-quite.js" defer></script> y un botón con onclick="abrirQuite()"
   Tercios: 1) Saltos  2) Capotazos  3) Muletazos  y  Suerte suprema (estocada)
   ========================================================= */
(function () {
    var ROJO = '#7a0000', ORO = '#d4af37';
    var META_SALTOS = 1000;      // metros para pasar al 2º tercio
    var META_CAPOTE = 8;         // capotazos para pasar al 3º tercio
    var META_MULETA = 10;        // muletazos para entrar a matar

    var capa, cv, cx, W, H, SUELO, CAJA, abierto = false, raf = null;
    var estado, tercio, torero, toros, polvo, vel, metros, siguiente, t, pases, puntos,
        aviso, avisoT, oleT, animPase, espera, aguja, intentos, resultado, trofeo, record;

    try { record = parseInt(localStorage.getItem('ptp_quite_record') || '0', 10) || 0; } catch (e) { record = 0; }

    /* ---------- ventana ---------- */
    function crearVentana() {
        var css = document.createElement('style');
        css.textContent =
            '#quite-capa{position:fixed;inset:0;background:rgba(20,0,0,.82);z-index:99999;display:none;align-items:center;justify-content:center;padding:12px;}' +
            '#quite-capa.abierta{display:flex;}' +
            '#quite-caja{width:100%;max-width:840px;background:#f5ede1;border:3px solid ' + ORO + ';border-radius:14px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.5);}' +
            '#quite-cab{background:' + ROJO + ';color:#fff;display:flex;align-items:center;justify-content:space-between;padding:8px 14px;font:bold 18px "Segoe UI",Arial,sans-serif;}' +
            '#quite-cerrar{background:none;border:2px solid ' + ORO + ';color:' + ORO + ';font:bold 18px Arial;width:34px;height:34px;border-radius:50%;cursor:pointer;line-height:28px;}' +
            '#quite-lienzo{display:block;width:100%;height:auto;background:#e9cf9a;cursor:pointer;touch-action:manipulation;-webkit-user-select:none;user-select:none;}' +
            '#quite-pie{font:13px "Segoe UI",Arial,sans-serif;color:#555;padding:8px 14px;text-align:center;}';
        document.head.appendChild(css);
        capa = document.createElement('div');
        capa.id = 'quite-capa';
        capa.innerHTML =
            '<div id="quite-caja" role="dialog" aria-label="Juego El Quite">' +
            '<div id="quite-cab"><span>🐂 El Quite</span><button id="quite-cerrar" aria-label="Cerrar">✕</button></div>' +
            '<canvas id="quite-lienzo" width="800" height="300"></canvas>' +
            '<div id="quite-pie">Toca la pantalla o pulsa la barra espaciadora. Saltos → Capotazos → Muletazos → Estocada.</div>' +
            '</div>';
        document.body.appendChild(capa);
        cv = document.getElementById('quite-lienzo');
        cx = cv.getContext('2d');
        document.getElementById('quite-cerrar').addEventListener('click', cerrar);
        capa.addEventListener('click', function (e) { if (e.target === capa) cerrar(); });
        cv.addEventListener('pointerdown', function (e) { e.preventDefault(); accion(); });
        document.addEventListener('keydown', function (e) {
            if (!abierto) return;
            if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); accion(); }
            if (e.code === 'Escape') cerrar();
        });
    }

    var scrollAntes = '';
    window.abrirQuite = function () {
        if (!capa) crearVentana();
        cv.width = window.innerWidth < 600 ? 480 : 800;
        W = cv.width; H = cv.height; SUELO = 240; CAJA = Math.min(480, W - 30);
        nuevaPartida(); estado = 'inicio';
        capa.classList.add('abierta'); abierto = true;
        scrollAntes = document.body.style.overflow; document.body.style.overflow = 'hidden';
        if (!raf) bucle();
    };
    function cerrar() {
        if (!capa) return;
        capa.classList.remove('abierta'); abierto = false;
        document.body.style.overflow = scrollAntes;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    /* ---------- partida ---------- */
    function nuevaPartida() {
        tercio = 1; torero = { x: 90, y: SUELO, vy: 0, enSuelo: true };
        toros = []; polvo = []; vel = 6; metros = 0; siguiente = 60; t = 0;
        pases = 0; puntos = 0; aviso = ''; avisoT = 0; oleT = 0; animPase = 0; espera = 0;
        intentos = 0; resultado = ''; trofeo = '';
    }

    function cambioDeTercio(n) {
        tercio = n; toros = []; espera = 50; pases = 0; animPase = 0;
        torero.y = SUELO; torero.vy = 0; torero.enSuelo = true; torero.x = n === 1 ? 90 : 150;
        estado = 'cambio'; avisoT = 150;
        aviso = n === 2 ? 'Segundo tercio: CAPOTAZOS' : n === 3 ? 'Tercer tercio: MULETAZOS' : 'SUERTE SUPREMA';
        if (n === 4) { aguja = 0; intentos = 0; }
    }

    function accion() {
        if (estado === 'inicio' || estado === 'cogida' || estado === 'fin') { nuevaPartida(); estado = 'jugando'; return; }
        if (estado === 'cambio' || estado === 'resultado') return;
        if (tercio === 1) {
            if (torero.enSuelo) { torero.vy = -13.5; torero.enSuelo = false; }
        } else if (tercio === 2 || tercio === 3) {
            var b = toros[0];
            if (!b || b.estado !== 'viene') return;
            var z = zona();
            if (b.x >= z[0] && b.x <= z[1]) {
                b.estado = 'pasa'; animPase = 22; oleT = 40; pases++; puntos += tercio === 2 ? 25 : 40;
            } else if (b.x > z[1] && b.x < W) {
                cogida();
            }
        } else if (tercio === 4) {
            estocada();
        }
    }

    function zona() {
        var ancho = tercio === 2 ? 75 : 52;
        return [torero.x + 38, torero.x + 38 + ancho];
    }

    function cogida() {
        estado = 'cogida';
        guardarRecord();
    }
    function guardarRecord() {
        var total = Math.floor(puntos + metros);
        if (total > record) { record = total; try { localStorage.setItem('ptp_quite_record', String(total)); } catch (e) {} }
    }

    function estocada() {
        intentos++;
        var d = Math.abs(Math.sin(aguja)); // 0 = centro
        if (d < 0.12) { resultado = '¡Estocada hasta la bola!'; puntos += [400, 200, 100][intentos - 1]; }
        else if (d < 0.35) { resultado = 'Estocada'; puntos += [250, 120, 60][intentos - 1]; }
        else { resultado = 'Pinchazo'; }
        var muerto = resultado !== 'Pinchazo';
        if (muerto) {
            if (intentos === 1 && d < 0.12) trofeo = 'DOS OREJAS Y RABO · ¡PUERTA GRANDE!';
            else if (intentos === 1) trofeo = 'DOS OREJAS · ¡Puerta grande!';
            else if (intentos === 2) trofeo = 'UNA OREJA';
            else trofeo = 'Vuelta al ruedo';
        } else if (intentos >= 3) {
            trofeo = 'Silencio… se fue a los corrales'; muerto = true;
        }
        estado = 'resultado'; avisoT = 90;
        if (muerto) { estado = 'resultado'; avisoT = 100; resultadoFinal = true; } else { resultadoFinal = false; }
    }
    var resultadoFinal = false;

    /* ---------- lógica ---------- */
    function nuevoToroSalto() {
        var grande = Math.random() < Math.min(0.15 + metros / 4000, 0.45);
        toros.push({ x: W + 20, s: grande ? 1.2 : 1, fase: 0, estado: 'viene' });
        siguiente = Math.max(40, 95 - metros / 60) + Math.random() * 60;
        if (metros > 300 && Math.random() < 0.18) siguiente = 24;
    }
    function nuevoToroPase() {
        var v = tercio === 2 ? 6.5 + pases * 0.35 : 8 + pases * 0.4;
        toros.push({ x: W + 20, s: 1.1, fase: 0, estado: 'viene', v: v * (0.9 + Math.random() * 0.25) });
    }

    function actualizar() {
        t++;
        if (oleT > 0) oleT--;
        if (animPase > 0) animPase--;
        for (var j = polvo.length - 1; j >= 0; j--) { polvo[j].a -= .03; polvo[j].r += .3; if (polvo[j].a <= 0) polvo.splice(j, 1); }

        if (estado === 'cambio') { if (--avisoT <= 0) estado = 'jugando'; return; }
        if (estado === 'resultado') {
            if (--avisoT <= 0) {
                if (resultadoFinal) { estado = 'fin'; guardarRecord(); }
                else { estado = 'jugando'; aguja = Math.random() * 3; }
            }
            return;
        }
        if (estado !== 'jugando') return;

        if (tercio === 1) {
            vel = 6 + metros / 400; metros += vel / 10;
            torero.vy += 0.7; torero.y += torero.vy;
            if (torero.y >= SUELO) { torero.y = SUELO; torero.vy = 0; torero.enSuelo = true; }
            if (--siguiente <= 0) nuevoToroSalto();
            for (var i = toros.length - 1; i >= 0; i--) {
                var b = toros[i];
                b.x -= vel * 1.15; b.fase += 0.35;
                if (t % 3 === 0) polvo.push({ x: b.x + 70 * b.s, y: SUELO - 4, r: 3 + Math.random() * 4, a: .6 });
                if (b.x + 90 * b.s < -10) toros.splice(i, 1);
                var tx = torero.x - 10, ty = torero.y - 60, tw = 20, th = 58;
                var bx = b.x + 8, by = SUELO - 44 * b.s, bw = 62 * b.s, bh = 44 * b.s;
                if (tx < bx + bw && tx + tw > bx && ty < by + bh && ty + th > by) { cogida(); return; }
            }
            if (metros >= META_SALTOS) { puntos += Math.floor(metros); metros = 0; cambioDeTercio(2); }
        } else if (tercio === 2 || tercio === 3) {
            if (!toros.length) { if (--espera <= 0) nuevoToroPase(); }
            var b2 = toros[0];
            if (b2) {
                b2.fase += 0.4;
                if (b2.estado === 'viene') {
                    b2.x -= b2.v;
                    if (t % 3 === 0) polvo.push({ x: b2.x + 75, y: SUELO - 4, r: 3 + Math.random() * 4, a: .6 });
                    if (b2.x < torero.x + 14) { cogida(); return; }
                } else {
                    b2.x -= b2.v * 1.1;
                    if (b2.x + 100 < -10) {
                        toros.shift(); espera = 35 + Math.random() * 35;
                        if (tercio === 2 && pases >= META_CAPOTE) cambioDeTercio(3);
                        else if (tercio === 3 && pases >= META_MULETA) cambioDeTercio(4);
                    }
                }
            }
        } else if (tercio === 4) {
            aguja += 0.06 + intentos * 0.015;
        }
    }

    /* ---------- dibujo ---------- */
    function ruedo() {
        var mov = estado === 'jugando' && tercio === 1 ? vel : 0;
        var g = cx.createLinearGradient(0, 0, 0, SUELO);
        g.addColorStop(0, '#f7e2b5'); g.addColorStop(1, '#e9cf9a');
        cx.fillStyle = g; cx.fillRect(0, 0, W, H);
        cx.fillStyle = ROJO; cx.fillRect(0, 70, W, 50);
        cx.fillStyle = ORO; cx.fillRect(0, 70, W, 5);
        cx.fillStyle = '#5c0000';
        var off = tercio === 1 ? (t * 6 * 0.3) % 80 : 0;
        for (var x = -off; x < W; x += 80) cx.fillRect(x, 75, 3, 45);
        cx.fillStyle = '#8b5a2b';
        var ob = tercio === 1 ? (t * 6 * 0.3) % 400 : 0;
        for (var bx = -ob + 200; bx < W + 100; bx += 400) { cx.fillRect(bx, 92, 60, 40); cx.fillStyle = '#6d4520'; cx.fillRect(bx, 92, 60, 4); cx.fillStyle = '#8b5a2b'; }
        cx.fillStyle = '#d9b77a'; cx.fillRect(0, SUELO, W, H - SUELO);
        cx.fillStyle = '#c9a466';
        var oa = tercio === 1 ? (t * (mov || 0)) % 40 : 0;
        for (var a = -oa; a < W; a += 40) cx.fillRect(a, SUELO + 12, 14, 2);
        for (var a2 = -oa + 20; a2 < W; a2 += 40) cx.fillRect(a2, SUELO + 34, 10, 2);
        // rayas de picadores en 2º y 3º tercio
        if (tercio > 1) {
            cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 2;
            cx.beginPath(); cx.ellipse(W / 2, SUELO + 40, W * 0.42, 22, 0, Math.PI, 2 * Math.PI); cx.stroke();
        }
    }

    function toro(x, s, fase, dim) {
        // toro mirando a la izquierda; x = punta del hocico; s = escala
        cx.save(); cx.translate(x, SUELO); cx.scale(s, s);
        if (dim) cx.globalAlpha = 0.85;
        var p = Math.sin(fase) * 7;
        var NEGRO = '#151515', BRILLO = '#2a2a2a';
        // patas traseras (detrás)
        cx.strokeStyle = NEGRO; cx.lineCap = 'round'; cx.lineWidth = 6;
        pata(62, -26, 66 - p, -2); pata(72, -26, 74 + p, -2);
        // rabo
        cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(84, -36);
        cx.quadraticCurveTo(96, -28 + p * 0.6, 92, -10); cx.stroke();
        cx.fillStyle = NEGRO; cx.beginPath(); cx.ellipse(92, -8, 3, 5, 0.3, 0, Math.PI * 2); cx.fill();
        // cuerpo
        cx.fillStyle = NEGRO;
        cx.beginPath();
        cx.moveTo(18, -30);
        cx.quadraticCurveTo(24, -58, 40, -56);            // morrillo alto
        cx.quadraticCurveTo(62, -50, 84, -44);            // lomo
        cx.quadraticCurveTo(92, -34, 84, -22);            // grupa
        cx.quadraticCurveTo(60, -16, 34, -18);            // barriga
        cx.quadraticCurveTo(20, -18, 18, -30);
        cx.fill();
        // brillo del lomo
        cx.strokeStyle = BRILLO; cx.lineWidth = 3;
        cx.beginPath(); cx.moveTo(34, -52); cx.quadraticCurveTo(58, -48, 80, -41); cx.stroke();
        // patas delanteras
        cx.strokeStyle = NEGRO; cx.lineWidth = 6;
        pata(26, -24, 22 + p, -2); pata(36, -22, 38 - p, -2);
        // pezuñas
        cx.fillStyle = '#3b2a1a';
        [[22 + p, 0], [38 - p, 0], [66 - p, 0], [74 + p, 0]].forEach(function (q) { cx.fillRect(q[0] - 3, -3, 6, 3); });
        // cabeza baja, embistiendo
        cx.fillStyle = NEGRO;
        cx.beginPath();
        cx.moveTo(22, -40); cx.quadraticCurveTo(8, -40, 2, -28);
        cx.quadraticCurveTo(0, -22, 6, -20); cx.quadraticCurveTo(16, -22, 24, -28); cx.closePath(); cx.fill();
        // hocico
        cx.fillStyle = '#4a3a33'; cx.beginPath(); cx.ellipse(4, -23, 4, 3.5, 0, 0, Math.PI * 2); cx.fill();
        // ojo
        cx.fillStyle = '#d9d0c0'; cx.beginPath(); cx.arc(13, -33, 1.6, 0, Math.PI * 2); cx.fill();
        // cuernos (hacia delante y arriba)
        cx.strokeStyle = '#efe4cc'; cx.lineWidth = 3;
        cx.beginPath(); cx.moveTo(16, -40); cx.quadraticCurveTo(6, -50, -2, -50); cx.stroke();
        cx.strokeStyle = '#d8cbaa';
        cx.beginPath(); cx.moveTo(20, -41); cx.quadraticCurveTo(14, -54, 6, -56); cx.stroke();
        cx.fillStyle = '#2b2b2b'; cx.beginPath(); cx.arc(-2, -50, 1.5, 0, Math.PI * 2); cx.arc(6, -56, 1.5, 0, Math.PI * 2); cx.fill();
        // divisa (colores de la peña)
        cx.fillStyle = ROJO; cx.fillRect(34, -62, 4, 8); cx.fillStyle = ORO; cx.fillRect(38, -62, 4, 8);
        cx.restore();
        function pata(x1, y1, x2, y2) { cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2, y2); cx.stroke(); }
    }

    function personaje() {
        var x = torero.x, y = torero.y;
        var corre = tercio === 1 && torero.enSuelo && estado === 'jugando';
        var paso = corre ? Math.sin(t * 0.5) * 5 : 0;
        cx.lineCap = 'round';
        cx.strokeStyle = '#e8a0b4'; cx.lineWidth = 6;
        cx.beginPath(); cx.moveTo(x - 4, y - 24); cx.lineTo(x - 6 + paso, y - 2); cx.stroke();
        cx.beginPath(); cx.moveTo(x + 4, y - 24); cx.lineTo(x + 6 - paso, y - 2); cx.stroke();
        cx.fillStyle = '#111'; cx.fillRect(x - 10 + paso, y - 3, 9, 4); cx.fillRect(x + 2 - paso, y - 3, 9, 4);
        cx.fillStyle = ORO; cx.fillRect(x - 9, y - 46, 18, 24);
        cx.fillStyle = ROJO; cx.fillRect(x - 9, y - 30, 18, 8);
        cx.fillStyle = '#b8860b'; cx.fillRect(x - 9, y - 46, 3, 16); cx.fillRect(x + 6, y - 46, 3, 16);

        if (tercio === 1 || tercio === 4) {
            // capote recogido al viento / estoque en la suerte suprema
            if (tercio === 1) {
                cx.fillStyle = '#c2185b';
                cx.beginPath(); cx.moveTo(x + 8, y - 42);
                cx.quadraticCurveTo(x + 34, y - 36 + Math.sin(t * 0.3) * 4, x + 30, y - 12);
                cx.lineTo(x + 10, y - 20); cx.closePath(); cx.fill();
            } else {
                cx.fillStyle = '#c62828'; cx.beginPath(); cx.moveTo(x - 8, y - 38); cx.lineTo(x - 30, y - 10); cx.lineTo(x - 6, y - 14); cx.closePath(); cx.fill();
                cx.strokeStyle = '#cfd8dc'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x + 8, y - 42); cx.lineTo(x + 46, y - 50); cx.stroke();
            }
        } else {
            // capote (2º) o muleta (3º) por delante; barre de derecha a izquierda al dar el pase
            var k = animPase > 0 ? 1 - animPase / 22 : 0;
            var lado = Math.cos(k * Math.PI);          // 1 delante, -1 detrás
            var ancho = tercio === 2 ? 46 : 32;
            var alto = tercio === 2 ? 40 : 30;
            var mano = { x: x + 8 * lado, y: y - 40 };
            cx.fillStyle = tercio === 2 ? '#c2185b' : '#b71c1c';
            cx.beginPath(); cx.moveTo(mano.x, mano.y);
            cx.quadraticCurveTo(mano.x + ancho * lado, mano.y + 4, mano.x + ancho * lado, mano.y + alto);
            cx.lineTo(mano.x + 4 * lado, mano.y + alto - 6); cx.closePath(); cx.fill();
            if (tercio === 2) {
                cx.fillStyle = '#f2c94c';
                cx.beginPath(); cx.moveTo(mano.x + ancho * lado, mano.y + alto); cx.lineTo(mano.x + 4 * lado, mano.y + alto - 6);
                cx.lineTo(mano.x + 8 * lado, mano.y + alto - 2); cx.closePath(); cx.fill();
            } else {
                cx.strokeStyle = '#6d4c41'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(mano.x, mano.y); cx.lineTo(mano.x + ancho * lado, mano.y + 2); cx.stroke();
            }
        }
        cx.fillStyle = '#f1c27d'; cx.beginPath(); cx.arc(x, y - 53, 7, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = '#111';
        cx.beginPath(); cx.ellipse(x, y - 60, 11, 5, 0, Math.PI, 0); cx.fill();
        cx.beginPath(); cx.arc(x - 9, y - 59, 3, 0, Math.PI * 2); cx.arc(x + 9, y - 59, 3, 0, Math.PI * 2); cx.fill();
    }

    function txt(s, x, y, tam, color, al, maxAncho) {
        cx.font = 'bold ' + tam + 'px "Segoe UI", Arial, sans-serif';
        while (maxAncho && tam > 10 && cx.measureText(s).width > maxAncho) {
            tam--; cx.font = 'bold ' + tam + 'px "Segoe UI", Arial, sans-serif';
        }
        cx.textAlign = al || 'center'; cx.fillStyle = color; cx.fillText(s, x, y);
    }

    function cartel(l1, l2, l3) {
        var alto = l3 ? 130 : 110, y0 = 112;
        cx.fillStyle = 'rgba(122,0,0,0.88)'; cx.fillRect(W / 2 - CAJA / 2, y0, CAJA, alto);
        cx.strokeStyle = ORO; cx.lineWidth = 3; cx.strokeRect(W / 2 - CAJA / 2, y0, CAJA, alto);
        txt(l1, W / 2, y0 + 40, W < 600 ? 21 : 26, ORO, 'center', CAJA - 24);
        if (l2) txt(l2, W / 2, y0 + 72, W < 600 ? 14 : 17, '#fff', 'center', CAJA - 24);
        if (l3) txt(l3, W / 2, y0 + 100, W < 600 ? 13 : 15, '#f3e3b0', 'center', CAJA - 24);
    }

    function marcador() {
        var nombre = ['', 'Saltos', 'Capotazos', 'Muletazos', 'Estocada'][tercio];
        txt(tercio + 'º · ' + nombre, 14, 30, W < 600 ? 15 : 18, ROJO, 'left');
        var dcha;
        if (tercio === 1) dcha = Math.floor(metros) + ' / ' + META_SALTOS + ' m';
        else if (tercio === 2) dcha = pases + ' / ' + META_CAPOTE + ' pases';
        else if (tercio === 3) dcha = pases + ' / ' + META_MULETA + ' pases';
        else dcha = 'Intento ' + Math.min(intentos + 1, 3) + ' de 3';
        txt(dcha, W - 14, 30, W < 600 ? 15 : 18, ROJO, 'right');
        txt('Puntos: ' + Math.floor(puntos + metros) + '   ·   Récord: ' + record, W - 14, 50, 12, '#5c0000', 'right');
    }

    function dibujar() {
        ruedo();
        if (tercio === 2 || tercio === 3) {
            var z = zona();
            cx.fillStyle = 'rgba(212,175,55,0.35)'; cx.fillRect(z[0], SUELO - 2, z[1] - z[0], 10);
            cx.strokeStyle = ORO; cx.lineWidth = 2; cx.strokeRect(z[0], SUELO - 2, z[1] - z[0], 10);
        }
        polvo.forEach(function (q) { cx.fillStyle = 'rgba(190,150,90,' + q.a + ')'; cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, Math.PI * 2); cx.fill(); });
        // toro que ya pasó: por detrás del torero
        toros.forEach(function (b) { if (b.estado === 'pasa') toro(b.x, b.s, b.fase, true); });
        if (tercio === 4) toro(torero.x + 70, 1.15, 0, false);
        personaje();
        toros.forEach(function (b) { if (b.estado === 'viene') toro(b.x, b.s, b.fase, false); });
        if (oleT > 0) txt('¡Olé!', torero.x + 30, SUELO - 90 - (40 - oleT), 26, ROJO);

        if (tercio === 4 && estado === 'jugando') {
            var bw = Math.min(360, W - 60), bx = W / 2 - bw / 2, by = 150;
            cx.fillStyle = '#5c0000'; cx.fillRect(bx, by, bw, 18);
            cx.fillStyle = '#e0b84a'; cx.fillRect(W / 2 - bw * 0.175, by, bw * 0.35, 18);
            cx.fillStyle = '#2e7d32'; cx.fillRect(W / 2 - bw * 0.06, by, bw * 0.12, 18);
            var nx = W / 2 + Math.sin(aguja) * bw / 2;
            cx.fillStyle = '#fff'; cx.fillRect(nx - 2, by - 6, 4, 30);
            txt('¡Toca cuando la aguja esté en el verde!', W / 2, by - 14, W < 600 ? 13 : 15, ROJO);
        }
        marcador();

        if (estado === 'inicio') cartel('EL QUITE', 'Saltos · Capotazos · Muletazos · Estocada', 'Toca o pulsa espacio para salir al ruedo');
        else if (estado === 'cambio') cartel('¡Cambio de tercio!', aviso, tercio === 2 ? 'Toca cuando el toro pise la zona dorada' : tercio === 3 ? 'Zona más corta y toros más rápidos' : 'Entra a matar en el momento justo');
        else if (estado === 'resultado') cartel(resultado, resultadoFinal ? trofeo : 'Vuelve a perfilarte…');
        else if (estado === 'cogida') cartel('¡COGIDA!', 'Puntos: ' + Math.floor(puntos + metros) + '  ·  Récord: ' + record, 'Toca para volver a empezar');
        else if (estado === 'fin') cartel(trofeo, 'Puntos: ' + Math.floor(puntos) + '  ·  Récord: ' + record, 'Toca para torear otra tarde');
    }

    function bucle() {
        if (!abierto) { raf = null; return; }
        actualizar(); dibujar();
        raf = requestAnimationFrame(bucle);
    }
})();
