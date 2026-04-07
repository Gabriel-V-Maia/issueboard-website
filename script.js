/* kanban think attempt number 13 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CARDS = [
    { label: 'TODO', text: 'Adicionar paginação' },
    { label: 'WIP',  text: 'Refatorar cache' },
    { label: 'DONE', text: 'Setup do projeto' },
    { label: 'TODO', text: 'Documentar API' },
    { label: 'WIP',  text: 'Integrar CI/CD' },
    { label: 'DONE', text: 'Configurar ruff' },
    { label: 'TODO', text: 'FIXME: auth timeout' },
    { label: 'WIP',  text: 'Migrar banco de dados' },
    { label: 'DONE', text: 'Testes unitários' },
    { label: 'TODO', text: 'Revisar dependências' },
    { label: 'WIP',  text: 'Otimizar queries' },
    { label: 'DONE', text: 'Deploy automático' },
  ];

  const CARD_W = 160;
  const CARD_H = 58;
  const CORNER = 5;
  const ALPHA  = 0.055;  

  function randomCard() {
    const tmpl = CARDS[Math.floor(Math.random() * CARDS.length)];
    return {
      x: Math.random() * (window.innerWidth + 200) - 100,
      y: Math.random() * (window.innerHeight + 200) - 100,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      label: tmpl.label,
      text: tmpl.text,
      opacity: Math.random() * 0.5 + 0.3,  
    };
  }

  const particles = Array.from({ length: 28 }, randomCard);

  const COLS = [
    { title: 'Open',        x: 0.18 },
    { title: 'In Progress', x: 0.50 },
    { title: 'Done',        x: 0.82 },
  ];

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawCard(p) {
    const alpha = ALPHA * p.opacity;
    const x = p.x - CARD_W / 2;
    const y = p.y - CARD_H / 2;

    roundRect(ctx, x, y, CARD_W, CARD_H, CORNER);
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
    ctx.fill();

    roundRect(ctx, x, y, CARD_W, CARD_H, CORNER);
    ctx.strokeStyle = `rgba(255,255,255,${alpha * 3})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const pillW = 34, pillH = 13;
    roundRect(ctx, x + 8, y + 8, pillW, pillH, 3);
    ctx.fillStyle = `rgba(255,255,255,${alpha * 4})`;
    ctx.fill();

    ctx.font = `500 8px 'Geist Mono', monospace`;
    ctx.fillStyle = `rgba(255,255,255,${alpha * 14})`;
    ctx.textAlign = 'center';
    ctx.fillText(p.label, x + 8 + pillW / 2, y + 8 + 9);

    ctx.font = `300 9px 'Geist', sans-serif`;
    ctx.fillStyle = `rgba(255,255,255,${alpha * 10})`;
    ctx.textAlign = 'left';
    ctx.fillText(p.text, x + 8, y + CARD_H - 12);
  }

  function drawColLines() {
    const w = canvas.width;
    const h = canvas.height;

    COLS.forEach(col => {
      const cx = col.x * w;

      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = `rgba(255,255,255,0.025)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = `500 10px 'Geist Mono', monospace`;
      ctx.fillStyle = `rgba(255,255,255,0.06)`;
      ctx.textAlign = 'center';
      ctx.fillText(col.title.toUpperCase(), cx, 48);
    });
  }

  let raf;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawColLines();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -CARD_W)       p.x = canvas.width + CARD_W;
      if (p.x > canvas.width + CARD_W)  p.x = -CARD_W;
      if (p.y < -CARD_H)       p.y = canvas.height + CARD_H;
      if (p.y > canvas.height + CARD_H) p.y = -CARD_H;

      drawCard(p);
    });

    raf = requestAnimationFrame(tick);
  }

  tick();
})();
