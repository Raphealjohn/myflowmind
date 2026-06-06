/* MyFlowMind — ambient "constellation" background effect
   Subtle drifting dots + connecting lines in the brand cobalt/sky.
   Sits behind page content; auto-disables for reduced-motion and small
   screens; pauses when the tab is hidden. Pure vanilla, no deps. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  if (innerWidth < 760) return;            // keep mobile clean + fast

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none';
  (document.body || document.documentElement).appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, N = 0, pts = [], mouse = { x: -1e4, y: -1e4 };
  var DOT = 'rgba(31,79,214,', LINE = 'rgba(56,189,248,';
  var maxD, maxD2, mRad, mRad2, running = true, raf = 0;

  function resize() {
    W = canvas.width = Math.floor(innerWidth * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    maxD = 130 * DPR; maxD2 = maxD * maxD;
    mRad = 150 * DPR; mRad2 = mRad * mRad;
    N = Math.min(70, Math.floor(innerWidth / 22));
    pts = [];
    for (var i = 0; i < N; i++) pts.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18 * DPR,
      vy: (Math.random() - 0.5) * 0.18 * DPR
    });
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < N; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6 * DPR, 0, 6.2832);
      ctx.fillStyle = DOT + '0.28)';
      ctx.fill();
      for (var j = i + 1; j < N; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < maxD2) {
          ctx.strokeStyle = LINE + ((1 - d2 / maxD2) * 0.16).toFixed(3) + ')';
          ctx.lineWidth = DPR;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md2 = mx * mx + my * my;
      if (md2 < mRad2) {
        ctx.strokeStyle = DOT + ((1 - md2 / mRad2) * 0.22).toFixed(3) + ')';
        ctx.lineWidth = DPR;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; frame(); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', function (e) { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; }, { passive: true });
  addEventListener('pointerout', function () { mouse.x = mouse.y = -1e4; }, { passive: true });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  resize();
  frame();
})();
