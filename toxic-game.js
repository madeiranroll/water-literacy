/**
 * toxic-game.js
 * Fullscreen toxic-label shooting game for the hero section.
 * Drop this file next to index.html — no dependencies required.
 */
(function () {
  'use strict';

  /* ── CONFIG ──────────────────────────────────────────────────── */
  const LABELS    = ['MSG','BENZENE','TIO2','SORBITOL','GREENWASHING',
                     'ASPARTAME','PARFUM','PFAS','SUCRALOSE','PHTALATES',
                     'SULFATES','LEDS'];
  const FALL_MS   = 10000;   // ms until auto-fall
  const DIM_ALPHA = 0.30;    // overlay darkness

  /* ── STATE ───────────────────────────────────────────────────── */
  let state    = 'idle';     // idle | floating | falling | resting
  let objs     = [];
  let parts    = [];
  let triggered = false;
  let gameEl, dimEl, cvs, ctx, raf, fallTimer, heroObs;

  /* ── BOOT ────────────────────────────────────────────────────── */
  function boot() {
    const h = location.hash.replace('#', '');
    if (h && h !== 'home') return;
    build();
  }

  /* ── BUILD GAME ──────────────────────────────────────────────── */
  function build() {
    triggered = false;
    state     = 'floating';
    objs      = [];
    parts     = [];

    // Crosshair cursor over everything during game
    document.body.style.cursor = 'crosshair';

    /* root container — pointer-events:none so all website UI still works */
    gameEl = make('div');
    S(gameEl, { position:'fixed', inset:'0', zIndex:'500',
                pointerEvents:'none', overflow:'hidden' });

    /* dim layer */
    dimEl = make('div');
    S(dimEl, { position:'absolute', inset:'0',
               background:`rgba(0,0,0,${DIM_ALPHA})`,
               transition:'opacity 1.2s ease', pointerEvents:'none' });
    gameEl.appendChild(dimEl);

    /* particle canvas */
    cvs = make('canvas');
    S(cvs, { position:'absolute', inset:'0', pointerEvents:'none' });
    cvs.width  = innerWidth;
    cvs.height = innerHeight;
    ctx = cvs.getContext('2d');
    gameEl.appendChild(cvs);

    /* labels */
    LABELS.forEach(txt => {
      const bx = lerp(0.09, 0.91, Math.random()) * innerWidth;
      const by = lerp(0.14, 0.76, Math.random()) * innerHeight;

      const lbl = make('div');
      lbl.textContent = txt;
      S(lbl, {
        position    : 'absolute',
        left        : bx + 'px',
        top         : by + 'px',
        transform   : 'translate(-50%,-50%)',
        background  : 'linear-gradient(140deg,#d63020 0%,#e96618 55%,#c82018 100%)',
        border      : '2px solid rgba(255,145,75,0.85)',
        borderRadius: '26px',
        padding     : '9px 22px',
        fontFamily  : "'Raleway','Arial Black',sans-serif",
        fontSize    : '13px',
        fontWeight  : '800',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color       : '#ffe050',
        textShadow  : '0 0 10px rgba(255,220,50,0.95)',
        boxShadow   : '0 0 22px rgba(240,75,35,0.80),0 0 44px rgba(255,80,40,0.30),inset 0 0 12px rgba(255,100,40,0.20)',
        pointerEvents: 'auto',
        cursor      : 'crosshair',
        userSelect  : 'none',
        whiteSpace  : 'nowrap',
        zIndex      : '501',
        willChange  : 'transform,left,top',
      });

      const o = {
        el  : lbl,
        txt,
        x   : bx,  y  : by,
        bx  : bx,  by : by,
        dx  : (Math.random() - 0.5) * 0.28,  // base drift per frame
        dy  : (Math.random() - 0.5) * 0.20,
        ph  : Math.random() * Math.PI * 2,   // sine phase
        ps  : 0.006 + Math.random() * 0.012, // phase speed
        ax  : 55  + Math.random() * 95,      // sine amplitude x
        ay  : 38  + Math.random() * 62,      // sine amplitude y
        vfx : 0,   vfy : 0,                  // fall velocity
        alive: true, rest: false,
      };

      lbl.addEventListener('click', e => {
        e.stopPropagation();
        if (o.alive) { o.alive = false; shoot(o, e.clientX, e.clientY); }
      });

      gameEl.appendChild(lbl);
      objs.push(o);
    });

    document.body.appendChild(gameEl);
    raf       = requestAnimationFrame(loop);
    fallTimer = setTimeout(() => { if (!triggered) triggerFall(); }, FALL_MS);
    watchHero();
  }

  /* ── HERO SCROLL OBSERVER ────────────────────────────────────── */
  function watchHero() {
    const try_ = () => {
      const hero = document.querySelector('.brand-hero');
      if (hero) {
        heroObs = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting && !triggered) triggerFall();
        }, { threshold: 0.05 });
        heroObs.observe(hero);
      } else {
        setTimeout(try_, 250);
      }
    };
    try_();
  }

  /* ── MAIN LOOP ───────────────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    tickParts();
    if (state === 'floating') tickFloat();
    else if (state === 'falling') tickFall();
    raf = requestAnimationFrame(loop);
  }

  /* ── FLOATING PHYSICS ────────────────────────────────────────── */
  function tickFloat() {
    const W = innerWidth, H = innerHeight;
    objs.forEach(o => {
      if (!o.alive) return;
      o.ph += o.ps;
      o.bx += o.dx;
      o.by += o.dy;
      // bounce base position off walls
      if (o.bx < 100)   o.dx =  Math.abs(o.dx);
      if (o.bx > W-100) o.dx = -Math.abs(o.dx);
      if (o.by < 110)   o.dy =  Math.abs(o.dy);
      if (o.by > H-110) o.dy = -Math.abs(o.dy);

      o.x = o.bx + Math.sin(o.ph)        * o.ax;
      o.y = o.by + Math.cos(o.ph * 0.71) * o.ay;

      const rot = Math.sin(o.ph * 1.3) * 7; // gentle rocking
      o.el.style.left      = o.x + 'px';
      o.el.style.top       = o.y + 'px';
      o.el.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
    });
  }

  /* ── FALLING PHYSICS ─────────────────────────────────────────── */
  function tickFall() {
    const GND = innerHeight - 28;
    const W   = innerWidth;
    let anyMoving = false;

    objs.forEach(o => {
      if (!o.alive || o.rest) return;
      o.vfy += 0.56;        // gravity
      o.vfx *= 0.993;       // air friction
      o.y += o.vfy;
      o.x += o.vfx;

      // side walls
      if (o.x < 70)   { o.x = 70;   o.vfx =  Math.abs(o.vfx) * 0.4; }
      if (o.x > W-70) { o.x = W-70; o.vfx = -Math.abs(o.vfx) * 0.4; }

      if (o.y >= GND) {
        o.y    = GND;
        o.vfy *= -0.28;                       // bounce damping
        if (Math.abs(o.vfy) < 1.4) {
          o.vfy = 0; o.vfx = 0; o.rest = true;
          const r = (Math.random() - 0.5) * 10;
          o.el.style.transform = `translate(-50%,-50%) rotate(${r}deg)`;
        }
      }
      o.el.style.left = o.x + 'px';
      o.el.style.top  = o.y + 'px';
      if (!o.rest) anyMoving = true;
    });

    if (!anyMoving) {
      state = 'resting';
      document.body.style.cursor = '';   // restore normal cursor
      // labels keep cursor:crosshair on hover via their own style
    }
  }

  /* ── TRIGGER FALL ────────────────────────────────────────────── */
  function triggerFall() {
    if (triggered) return;
    triggered = true;
    state     = 'falling';

    // Fade and remove dim overlay
    dimEl.style.opacity = '0';
    setTimeout(() => { if (dimEl && dimEl.parentNode) dimEl.remove(); }, 1300);

    // Restore default cursor (labels keep crosshair)
    document.body.style.cursor = '';

    // Give each surviving label a kick
    objs.forEach(o => {
      if (!o.alive) return;
      o.vfy = 1.2 + Math.random() * 2.8;
      o.vfx = (Math.random() - 0.5) * 7;
    });
  }

  /* ── SHOOT LABEL ─────────────────────────────────────────────── */
  function shoot(o, cx, cy) {
    flashScreen();
    muzzleFlash(cx, cy);
    screenShake();
    blastParticles(o.x, o.y);
    flyChars(o.txt, o.x, o.y);
    o.el.style.display = 'none';
  }

  /* brief white screen flash */
  function flashScreen() {
    const f = make('div');
    S(f, { position:'fixed', inset:'0', zIndex:'600',
           background:'rgba(255,230,150,0.13)', pointerEvents:'none' });
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      f.style.transition = 'opacity 0.20s';
      f.style.opacity    = '0';
      setTimeout(() => f.remove(), 250);
    });
  }

  /* radial muzzle glow at cursor */
  function muzzleFlash(x, y) {
    const sz = 52 + Math.random() * 36;
    const f  = make('div');
    S(f, {
      position    : 'fixed',
      left        : x + 'px',
      top         : y + 'px',
      width       : sz + 'px',
      height      : sz + 'px',
      borderRadius: '50%',
      background  : 'radial-gradient(circle,rgba(255,255,210,1) 0%,rgba(255,190,55,0.95) 26%,rgba(255,85,20,0.65) 58%,transparent 80%)',
      transform   : 'translate(-50%,-50%) scale(0.1)',
      pointerEvents: 'none',
      zIndex      : '601',
    });
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      f.style.transition = 'transform 0.07s ease-out';
      f.style.transform  = 'translate(-50%,-50%) scale(1)';
      setTimeout(() => {
        f.style.transition = 'transform 0.13s ease, opacity 0.13s ease';
        f.style.opacity    = '0';
        f.style.transform  = 'translate(-50%,-50%) scale(2.4)';
        setTimeout(() => f.remove(), 200);
      }, 70);
    });
  }

  /* brief camera shake */
  function screenShake() {
    const t0 = performance.now(), dur = 200;
    const tick = now => {
      const p = (now - t0) / dur;
      if (p >= 1) { if (gameEl) gameEl.style.transform = ''; return; }
      const i = (1 - p) * 7.5;
      if (gameEl) gameEl.style.transform =
        `translate(${(Math.random()-0.5)*i}px,${(Math.random()-0.5)*i}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* spawn canvas particles from explosion */
  function blastParticles(x, y) {
    const C = ['#ff4422','#ff8833','#ffdd44','#ff2255',
               '#ff6600','#ffaa00','#ffffff','#ff5511','#cc2200'];

    // Shrapnel / debris shards
    for (let i = 0; i < 26; i++) {
      const a   = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 16;
      const col = C[~~(Math.random() * C.length)];
      parts.push({
        x   : x + (Math.random()-0.5)*55,
        y   : y + (Math.random()-0.5)*22,
        vx  : Math.cos(a) * spd,
        vy  : Math.sin(a) * spd - 3,
        life: 1,
        dc  : 0.017 + Math.random() * 0.024,
        gv  : 0.40,
        rot : Math.random() * Math.PI * 2,
        rs  : (Math.random()-0.5) * 0.42,
        col,
        type: Math.random() > 0.32 ? 'rect' : 'circ',
        w   : 3  + Math.random() * 11,
        h   : 2  + Math.random() * 6,
        r   : 2  + Math.random() * 5,
      });
    }

    // Smoke puffs
    for (let i = 0; i < 12; i++) {
      const a   = Math.random() * Math.PI * 2;
      const spd = 0.5 + Math.random() * 3;
      parts.push({
        x   : x + (Math.random()-0.5)*28,
        y   : y + (Math.random()-0.5)*14,
        vx  : Math.cos(a) * spd,
        vy  : Math.sin(a) * spd - 1.8,
        life: 0.78,
        dc  : 0.011 + Math.random() * 0.010,
        gv  : -0.04,
        rot : 0, rs: 0, col: null,
        type: 'smoke',
        r   : 9  + Math.random() * 15,
        w   : 0, h: 0,
      });
    }

    // Bright sparks / streaks
    for (let i = 0; i < 14; i++) {
      const a   = Math.random() * Math.PI * 2;
      const spd = 9 + Math.random() * 22;
      parts.push({
        x   : x,  y,
        vx  : Math.cos(a) * spd,
        vy  : Math.sin(a) * spd - 4,
        life: 1,
        dc  : 0.038 + Math.random() * 0.02,
        gv  : 0.55,
        rot : 0, rs: 0,
        col : Math.random() > 0.5 ? '#ffee44' : '#ffaa22',
        type: 'spark',
        w   : 0, h: 0, r: 1.5,
      });
    }
  }

  /* fly individual characters outward as DOM elements */
  function flyChars(txt, x, y) {
    const arr = txt.replace(/\s/g, '').split('');
    const n   = Math.min(arr.length, Math.max(3, ~~(arr.length * 0.65)));
    for (let i = 0; i < n; i++) {
      const ch  = arr[~~(Math.random() * arr.length)];
      const d   = make('div');
      d.textContent = ch;
      S(d, {
        position    : 'fixed',
        left        : x + 'px',
        top         : y + 'px',
        fontFamily  : "'Raleway','Arial Black',sans-serif",
        fontSize    : '15px',
        fontWeight  : '800',
        color       : '#ffe060',
        textShadow  : '0 0 8px rgba(255,200,50,0.95)',
        pointerEvents: 'none',
        zIndex      : '602',
        transform   : 'translate(-50%,-50%)',
        letterSpacing: '0.12em',
        lineHeight  : '1',
      });
      document.body.appendChild(d);

      const angle = Math.random() * Math.PI * 2;
      const spd   = 4 + Math.random() * 11;
      let vx = Math.cos(angle) * spd;
      let vy = Math.sin(angle) * spd - 3;
      let px = x, py = y, lf = 1;

      const step = () => {
        lf -= 0.026;
        if (lf <= 0) { d.remove(); return; }
        vy += 0.32;
        px += vx; py += vy;
        d.style.left    = px + 'px';
        d.style.top     = py + 'px';
        d.style.opacity = Math.max(0, lf) + '';
        d.style.fontSize = (15 + (1 - lf) * 11) + 'px';
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  /* ── PARTICLE RENDERING ──────────────────────────────────────── */
  function tickParts() {
    parts = parts.filter(p => p.life > 0);
    parts.forEach(p => {
      p.life -= p.dc;
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += p.gv;
      p.vx   *= 0.984;
      p.rot  += p.rs;

      const a = Math.max(0, p.life);
      ctx.save();
      ctx.globalAlpha = a;

      if (p.type === 'smoke') {
        ctx.fillStyle = `rgba(125,125,125,${a * 0.44})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1.45 - p.life * 0.45), 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'spark') {
        ctx.strokeStyle = p.col;
        ctx.lineWidth   = 1.6;
        ctx.shadowColor = p.col;
        ctx.shadowBlur  = 9;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.52, p.y - p.vy * 0.52);
        ctx.stroke();

      } else if (p.type === 'rect') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle   = p.col;
        ctx.shadowColor = p.col;
        ctx.shadowBlur  = 5;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);

      } else { // circ
        ctx.fillStyle   = p.col;
        ctx.shadowColor = p.col;
        ctx.shadowBlur  = 7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  /* ── UTILITIES ───────────────────────────────────────────────── */
  function make(tag) { return document.createElement(tag); }
  function S(el, obj) { Object.entries(obj).forEach(([k, v]) => (el.style[k] = v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── RESIZE ──────────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    if (cvs) { cvs.width = innerWidth; cvs.height = innerHeight; }
  });

  /* ── START ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
