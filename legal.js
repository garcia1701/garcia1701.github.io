// Enlaces legales en el pie de cada página (Peña Taurina Peguerinos)
(function () {
  var f = document.querySelector('footer');
  if (!f || f.querySelector('.pie-legal')) return;
  var b = location.protocol === 'file:' ? '' : '/';
  var d = document.createElement('div');
  d.className = 'pie-legal';
  d.style.cssText = 'margin-top:6px;font-size:11px;opacity:.85';
  d.innerHTML = '<a href="' + b + 'aviso-legal.html" style="color:inherit">Aviso legal</a> · ' +
    '<a href="' + b + 'privacidad.html" style="color:inherit">Privacidad</a> · ' +
    '<a href="' + b + 'cookies.html" style="color:inherit">Cookies</a>';
  f.appendChild(d);
})();
