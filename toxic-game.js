/**
 * toxic-game.js  v2
 * Colors match site palette · 15 s timer · custom targeting cursor
 * Labels fall to absolute bottom of the document
 */
(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  const LABELS  = ['MSG','BENZENE','TIO2','SORBITOL','GREENWASHING',
                   'ASPARTAME','PARFUM','PFAS','SUCRALOSE','PHTALATES',
                   'SULFATES','LEDS'];
  const FALL_MS = 15000;

  /* Site palette (from CSS variables) */
  const C = {
    rebel   : '#962D49',
    rebelLt : '#B83858',
    rebelDk : '#5C1828',
    rose    : '#D46882',
    roseLt  : '#E8B4C4',
    roseGold: '#C4929C',
    text    : '#EDE0E6',
  };

  /* ── STATE ──────────────────────────────────────────────── */
  let state     = 'idle';
  let objs      = [];
  let parts     = [];
  let triggered = false;
  let gameEl, dimEl, taglineEl, cvs, ctx, raf, fallTimer, heroObs;
  let cursorEl, fallContainer, docGround, heroEl;

  /* ── BOOT ───────────────────────────────────────────────── */
  function boot() {
    const h = location.hash.replace('#', '');
    if (h && h !== 'home') return;
    build();
  }

  /* ── BUILD ──────────────────────────────────────────────── */
  function build() {
    triggered = false; state = 'floating'; objs = []; parts = [];

    /* inject hero transition styles once */
    if (!document.getElementById('toxic-game-styles')) {
      const st = mk('style');
      st.id = 'toxic-game-styles';
      st.textContent = [
        /* transitions always on — so the return animation is also smooth */
        '.brand-hero{transition:padding-right .9s cubic-bezier(.4,0,.2,1)!important}',
        '.brand-hero .container{transition:transform .9s cubic-bezier(.4,0,.2,1)!important}',
        '.brand-hero .brand-hero__title{transition:font-size .9s cubic-bezier(.4,0,.2,1)!important}',
        '.brand-hero .brand-hero__tag{transition:font-size .9s cubic-bezier(.4,0,.2,1),max-width .9s cubic-bezier(.4,0,.2,1)!important}',
        '.brand-hero .label{transition:font-size .9s cubic-bezier(.4,0,.2,1)!important}',
        '.brand-hero .btn{transition:font-size .9s cubic-bezier(.4,0,.2,1),padding .9s cubic-bezier(.4,0,.2,1)!important}',
        /* game-intro state — shift content to upper-left corner */
        '.brand-hero.game-intro{padding-right:52%!important}',
        '.brand-hero.game-intro .container{transform:translateY(-28vh)!important}',
        '.brand-hero.game-intro .brand-hero__title{font-size:4.4rem!important}',
        '.brand-hero.game-intro .brand-hero__title--italic{font-size:3.2rem!important}',
        '.brand-hero.game-intro .brand-hero__tag{font-size:.82rem!important;max-width:100%!important}',
        '.brand-hero.game-intro .label{font-size:.65rem!important}',
        '.brand-hero.game-intro .btn{font-size:.78rem!important;padding:.5em 1.1em!important}',
      ].join('');
      document.head.appendChild(st);
    }

    /* custom cursor */
    document.body.style.cursor = 'none';
    cursorEl = mk('div');
    cursorEl.id = 'toxic-cursor';
    S(cursorEl, {
      position     : 'fixed',
      zIndex       : '1000',
      pointerEvents: 'none',
      transform    : 'translate(-50%,-50%)',
      display      : 'none',
      filter       : 'drop-shadow(0 0 7px #962D49) drop-shadow(0 0 14px rgba(150,45,73,0.4))',
    });
    cursorEl.innerHTML = buildCursorSVG();
    document.body.appendChild(cursorEl);
    document.addEventListener('mousemove', onMove);

    /* fixed game overlay (pointer-events:none — website stays interactive) */
    gameEl = mk('div');
    gameEl.id = 'toxic-game';
    S(gameEl, { position:'fixed', inset:'0', zIndex:'500',
                pointerEvents:'none', overflow:'hidden' });

    dimEl = mk('div');
    S(dimEl, { position:'absolute', inset:'0', background:'rgba(0,0,0,0.60)',
               transition:'opacity 1.2s ease', pointerEvents:'none' });
    gameEl.appendChild(dimEl);

    /* tagline */
    /* On desktop the hero is pushed to the left 48% via .game-intro padding-right:52%,
       so we centre the tagline in the right half (midpoint = 74%).
       On mobile the layout stacks so we keep it centred. */
    const taglineLeft = innerWidth <= 768 ? '50%' : '74%';

    taglineEl = mk('div');
    taglineEl.textContent = "Give 'em hell, child.";
    S(taglineEl, {
      position     : 'absolute',
      top          : '50%',
      left         : taglineLeft,
      transform    : 'translateX(-50%) translateY(calc(-50% + 14px))',
      fontFamily   : "'Raleway','Georgia',serif",
      fontStyle    : 'italic',
      fontSize     : '52px',
      fontWeight   : '700',
      letterSpacing: '0.04em',
      color        : 'rgba(237,224,230,0)',
      textShadow   : '0 0 0px rgba(150,45,73,0)',
      pointerEvents: 'none',
      whiteSpace   : 'nowrap',
      zIndex       : '502',
      transition   : 'color 1s ease, text-shadow 1s ease, transform 1s ease',
    });
    gameEl.appendChild(taglineEl);
    /* fade in after a short delay so it doesn't fight the initial load */
    setTimeout(() => {
      if (!taglineEl) return;
      taglineEl.style.color      = 'rgba(237,224,230,1)';
      taglineEl.style.textShadow =
        '0 0 30px rgba(150,45,73,0.9), 0 0 60px rgba(150,45,73,0.5), 0 2px 4px rgba(0,0,0,0.8)';
      taglineEl.style.transform  = 'translateX(-50%) translateY(-50%)';
    }, 800);

    /* canvas is a standalone fixed element so it survives gameEl removal */
    cvs = mk('canvas');
    S(cvs, { position:'fixed', inset:'0', pointerEvents:'none', zIndex:'499' });
    cvs.width = innerWidth; cvs.height = innerHeight;
    ctx = cvs.getContext('2d');
    document.body.appendChild(cvs);

    /* labels */
    LABELS.forEach(txt => {
      const bx = lerp(0.09, 0.91, Math.random()) * innerWidth;
      /* split labels into upper / lower halves so they never drift
         into the centre where the tagline lives                    */
      const upperHalf = Math.random() > 0.5;
      const by = upperHalf
        ? lerp(0.10, 0.34, Math.random()) * innerHeight
        : lerp(0.66, 0.88, Math.random()) * innerHeight;

      /* visible label pill */
      const lbl = mk('div');
      lbl.textContent = txt;
      S(lbl, {
        background   : 'linear-gradient(140deg,#5C1828 0%,#962D49 55%,#5C1828 100%)',
        border       : '2px solid rgba(184,56,88,0.85)',
        borderRadius : '26px', padding: '9px 22px',
        fontFamily   : "'Raleway','Arial Black',sans-serif",
        fontSize     : '13px', fontWeight: '800',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color        : '#EDE0E6',
        textShadow   : '0 0 10px rgba(212,104,130,0.7)',
        boxShadow    : '0 0 20px rgba(150,45,73,0.75),0 0 40px rgba(150,45,73,0.28),inset 0 0 12px rgba(92,24,40,0.40)',
        userSelect   : 'none', whiteSpace: 'nowrap',
        pointerEvents: 'none',   /* clicks handled by hitZone */
      });

      /* transparent hit-zone wrapper — 28 px larger on every side */
      const hitZone = mk('div');
      S(hitZone, {
        position     : 'absolute',
        left         : bx+'px', top: by+'px',
        transform    : 'translate(-50%,-50%)',
        padding      : '28px',
        cursor       : 'none',
        pointerEvents: 'auto',
        zIndex       : '501',
        willChange   : 'left,top,transform',
      });
      hitZone.appendChild(lbl);

      const o = {
        el: hitZone, txt,
        x:bx, y:by, bx, by,
        upperHalf,
        dx:(Math.random()-0.5)*0.14, dy:(Math.random()-0.5)*0.10,
        ph:Math.random()*Math.PI*2,  ps:0.003+Math.random()*0.006,
        ax:55+Math.random()*95,      ay:38+Math.random()*62,
        vfx:0, vfy:0, alive:true, rest:false,
      };
      hitZone.addEventListener('click', e => {
        e.stopPropagation();
        if (o.alive) { o.alive = false; shoot(o, e.clientX, e.clientY); }
      });
      gameEl.appendChild(hitZone);
      objs.push(o);
    });

    document.body.appendChild(gameEl);
    raf       = requestAnimationFrame(loop);
    fallTimer = setTimeout(() => { if (!triggered) triggerFall(); }, FALL_MS);
    watchHero();
  }

  /* ── CURSOR SVG ─────────────────────────────────────────── */
  function buildCursorSVG() {
    return `<svg width="90" height="90" viewBox="-45 -45 90 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="tcGlow">
          <feGaussianBlur stdDeviation="2.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <style>
          @keyframes tcPulse{0%,100%{opacity:.80}50%{opacity:1}}
          .tc-outer{animation:tcPulse 2.2s ease-in-out infinite}
        </style>
      </defs>
      <!-- outer pulsing ring -->
      <circle class="tc-outer" r="38" fill="none"
        stroke="#962D49" stroke-width="1.8" filter="url(#tcGlow)"/>
      <!-- middle ring -->
      <circle r="22" fill="none" stroke="#D46882" stroke-width="1" opacity=".55"/>
      <!-- inner ring -->
      <circle r="9" fill="none" stroke="#B83858" stroke-width="1.5" opacity=".85"/>
      <!-- centre dot -->
      <circle r="2.4" fill="#EDE0E6"/>
      <!-- crosshair arms (gap 10–28) -->
      <line x1="-45" y1="0" x2="-28" y2="0" stroke="#EDE0E6" stroke-width="1.4" opacity=".92"/>
      <line x1=" 28" y1="0" x2=" 45" y2="0" stroke="#EDE0E6" stroke-width="1.4" opacity=".92"/>
      <line x1="0" y1="-45" x2="0" y2="-28" stroke="#EDE0E6" stroke-width="1.4" opacity=".92"/>
      <line x1="0" y1=" 28" x2="0" y2=" 45" stroke="#EDE0E6" stroke-width="1.4" opacity=".92"/>
      <!-- bold cardinal ticks on outer ring -->
      <line x1="0" y1="-44" x2="0" y2="-35" stroke="#B83858" stroke-width="2.5" opacity=".95"/>
      <line x1="0" y1=" 35" x2="0" y2=" 44" stroke="#B83858" stroke-width="2.5" opacity=".95"/>
      <line x1="-44" y1="0" x2="-35" y2="0" stroke="#B83858" stroke-width="2.5" opacity=".95"/>
      <line x1=" 35" y1="0" x2=" 44" y2="0" stroke="#B83858" stroke-width="2.5" opacity=".95"/>
      <!-- small diagonal accent ticks -->
      <line x1="-29" y1="-29" x2="-24" y2="-24" stroke="#D46882" stroke-width="1" opacity=".45"/>
      <line x1=" 24" y1="-24" x2=" 29" y2="-29" stroke="#D46882" stroke-width="1" opacity=".45"/>
      <line x1="-29" y1=" 29" x2="-24" y2=" 24" stroke="#D46882" stroke-width="1" opacity=".45"/>
      <line x1=" 24" y1=" 24" x2=" 29" y2=" 29" stroke="#D46882" stroke-width="1" opacity=".45"/>
    </svg>`;
  }

  /* ── CURSOR TRACKING ────────────────────────────────────── */
  function onMove(e) {
    if (!cursorEl || state === 'idle' || state === 'resting') return;
    cursorEl.style.display = 'block';
    cursorEl.style.left    = e.clientX + 'px';
    cursorEl.style.top     = e.clientY + 'px';
  }

  /* ── HERO OBSERVER ──────────────────────────────────────── */
  function watchHero() {
    const try_ = () => {
      const hero = document.querySelector('.brand-hero');
      if (hero) {
        heroEl = hero;
        hero.classList.add('game-intro');   /* shift left + shrink text */
        heroObs = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting && !triggered) triggerFall();
        }, { threshold: 0.05 });
        heroObs.observe(hero);
      } else setTimeout(try_, 250);
    };
    try_();
  }

  /* ── MAIN LOOP ──────────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    tickParts();
    if      (state === 'floating') tickFloat();
    else if (state === 'falling')  tickFall();
    raf = requestAnimationFrame(loop);
  }

  /* ── FLOATING PHYSICS ───────────────────────────────────── */
  function tickFloat() {
    const W = innerWidth, H = innerHeight;
    objs.forEach(o => {
      if (!o.alive) return;
      o.ph += o.ps;
      o.bx += o.dx; o.by += o.dy;
      if (o.bx < 100)   o.dx =  Math.abs(o.dx);
      if (o.bx > W-100) o.dx = -Math.abs(o.dx);
      if (o.upperHalf) {
        if (o.by < 110)      o.dy =  Math.abs(o.dy);
        if (o.by > H * 0.35) o.dy = -Math.abs(o.dy);  /* stay clear of tagline */
      } else {
        if (o.by < H * 0.65) o.dy =  Math.abs(o.dy);  /* stay clear of tagline */
        if (o.by > H - 110)  o.dy = -Math.abs(o.dy);
      }
      o.x = o.bx + Math.sin(o.ph)        * o.ax;
      o.y = o.by + Math.cos(o.ph * 0.71) * o.ay;
      const rot = Math.sin(o.ph * 1.3) * 7;
      o.el.style.left      = o.x + 'px';
      o.el.style.top       = o.y + 'px';
      o.el.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
    });
  }

  /* ── FALL PHYSICS (document-space coords) ───────────────── */
  function tickFall() {
    let anyMoving = false;
    objs.forEach(o => {
      if (!o.alive || o.rest) return;
      o.vfy += 0.56; o.vfx *= 0.993;
      o.y += o.vfy; o.x += o.vfx;
      if (o.x < 70)            { o.x = 70;            o.vfx =  Math.abs(o.vfx)*0.4; }
      if (o.x > innerWidth-70) { o.x = innerWidth-70; o.vfx = -Math.abs(o.vfx)*0.4; }
      if (o.y >= docGround) {
        o.y    = docGround;
        o.vfy *= -0.28;
        if (Math.abs(o.vfy) < 1.4) {
          o.vfy = 0; o.vfx = 0; o.rest = true;
          o.el.style.transform =
            `translate(-50%,-50%) rotate(${(Math.random()-.5)*10}deg)`;
        }
      }
      o.el.style.left = o.x + 'px';
      o.el.style.top  = o.y + 'px';
      if (!o.rest) anyMoving = true;
    });
    if (!anyMoving) { state = 'resting'; onResting(); }
  }

  /* ── TRIGGER FALL ───────────────────────────────────────── */
  function triggerFall() {
    if (triggered) return;
    triggered = true; state = 'falling';

    dimEl.style.opacity = '0';
    if (taglineEl) {
      taglineEl.style.color      = 'rgba(237,224,230,0)';
      taglineEl.style.textShadow = '0 0 18px rgba(150,45,73,0)';
      taglineEl.style.transform  = 'translateX(-50%) translateY(calc(-50% + 22px))';
    }
    /* restore hero layout simultaneously with labels falling */
    if (heroEl) heroEl.classList.remove('game-intro');
    setTimeout(() => { if (dimEl.parentNode) dimEl.remove(); }, 1300);

    /* cursor stays active for the full 15 s — cleaned up in onResting() */
    const docH = document.body.scrollHeight;
    docGround  = docH - 32;

    fallContainer = mk('div');
    S(fallContainer, {
      position     : 'absolute',
      top:'0', left:'0', width:'100%',
      height       : docH + 'px',
      pointerEvents: 'none',
      zIndex       : '498',
    });
    document.body.appendChild(fallContainer);

    /* convert labels from viewport→document space, re-parent */
    objs.forEach(o => {
      if (!o.alive) return;
      o.x   += window.scrollX;
      o.y   += window.scrollY;
      o.vfy  = 1.2 + Math.random() * 2.8;
      o.vfx  = (Math.random() - 0.5) * 7;
      fallContainer.appendChild(o.el);
      o.el.style.left   = o.x + 'px';
      o.el.style.top    = o.y + 'px';
      o.el.style.zIndex = '498';
    });

    setTimeout(() => { if (gameEl && gameEl.parentNode) gameEl.remove(); }, 1400);
  }

  /* ── ON RESTING ─────────────────────────────────────────── */
  function onResting() {
    /* game over — restore normal cursor globally */
    document.removeEventListener('mousemove', onMove);
    document.body.style.cursor = '';
    if (cursorEl) cursorEl.style.display = 'none';

    /* crosshair cursor reappears only when hovering a surviving label */
    objs.forEach(o => {
      if (!o.alive || !o.rest) return;
      o.el.style.pointerEvents = 'auto';
      o.el.style.cursor        = 'none';
      o.el.addEventListener('mouseenter', () => {
        if (cursorEl) cursorEl.style.display = 'block';
      });
      o.el.addEventListener('mouseleave', () => {
        if (cursorEl) cursorEl.style.display = 'none';
      });
      o.el.addEventListener('mousemove', e => {
        if (cursorEl) {
          cursorEl.style.left = e.clientX + 'px';
          cursorEl.style.top  = e.clientY + 'px';
        }
      });
    });
  }

  /* ── SHOOT ──────────────────────────────────────────────── */
  function shoot(o, cx, cy) {
    flashScreen();
    muzzleFlash(cx, cy);
    if (state === 'floating') screenShake();
    /* cx/cy are always viewport coords from the click event */
    blastParticles(cx, cy);
    flyChars(o.txt, cx, cy);
    o.el.style.display = 'none';
  }

  function flashScreen() {
    const f = mk('div');
    S(f, { position:'fixed', inset:'0', zIndex:'610',
           background:'rgba(150,45,73,0.09)', pointerEvents:'none' });
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      f.style.transition = 'opacity 0.18s';
      f.style.opacity    = '0';
      setTimeout(() => f.remove(), 250);
    });
  }

  function muzzleFlash(x, y) {
    const sz = 52 + Math.random() * 38;
    const f  = mk('div');
    S(f, {
      position    : 'fixed', left: x+'px', top: y+'px',
      width       : sz+'px', height: sz+'px', borderRadius: '50%',
      background  : 'radial-gradient(circle,rgba(255,245,220,1) 0%,rgba(212,104,130,0.95) 28%,rgba(150,45,73,0.65) 58%,transparent 80%)',
      transform   : 'translate(-50%,-50%) scale(0.1)',
      pointerEvents: 'none', zIndex: '605',
    });
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      f.style.transition = 'transform 0.07s ease-out';
      f.style.transform  = 'translate(-50%,-50%) scale(1)';
      setTimeout(() => {
        f.style.transition = 'transform 0.13s ease, opacity 0.13s ease';
        f.style.opacity    = '0';
        f.style.transform  = 'translate(-50%,-50%) scale(2.5)';
        setTimeout(() => f.remove(), 200);
      }, 70);
    });
  }

  function screenShake() {
    if (!gameEl) return;
    const t0 = performance.now(), dur = 200;
    const tick = now => {
      const p = (now-t0)/dur;
      if (p >= 1) { gameEl.style.transform = ''; return; }
      const i = (1-p)*7.5;
      gameEl.style.transform =
        `translate(${(Math.random()-.5)*i}px,${(Math.random()-.5)*i}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function blastParticles(x, y) {
    const COLS = ['#962D49','#B83858','#D46882','#E8B4C4',
                  '#ffffff','#C4929C','#ffeecc','#5C1828'];
    for (let i = 0; i < 26; i++) {
      const a = Math.random()*Math.PI*2, s = 3+Math.random()*16;
      parts.push({
        x:x+(Math.random()-.5)*55, y:y+(Math.random()-.5)*22,
        vx:Math.cos(a)*s, vy:Math.sin(a)*s-3,
        life:1, dc:0.018+Math.random()*0.022, gv:0.40,
        rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*0.42,
        col:COLS[~~(Math.random()*COLS.length)],
        type:Math.random()>.32?'rect':'circ',
        w:3+Math.random()*11, h:2+Math.random()*6, r:2+Math.random()*5,
      });
    }
    for (let i = 0; i < 12; i++) {
      const a = Math.random()*Math.PI*2, s = 0.5+Math.random()*3;
      parts.push({
        x:x+(Math.random()-.5)*28, y,
        vx:Math.cos(a)*s, vy:Math.sin(a)*s-1.8,
        life:0.78, dc:0.011+Math.random()*0.010, gv:-0.04,
        rot:0, rs:0, col:null, type:'smoke', r:9+Math.random()*15, w:0, h:0,
      });
    }
    for (let i = 0; i < 14; i++) {
      const a = Math.random()*Math.PI*2, s = 9+Math.random()*22;
      parts.push({
        x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s-4,
        life:1, dc:0.038+Math.random()*0.02, gv:0.55,
        rot:0, rs:0,
        col:Math.random()>.5 ? '#E8B4C4' : '#fff5e0',
        type:'spark', w:0, h:0, r:1.5,
      });
    }
  }

  function flyChars(txt, x, y) {
    const arr = txt.replace(/\s/g,'').split('');
    const n   = Math.min(arr.length, Math.max(3, ~~(arr.length*0.65)));
    for (let i = 0; i < n; i++) {
      const ch = arr[~~(Math.random()*arr.length)];
      const d  = mk('div');
      d.textContent = ch;
      S(d, {
        position:'fixed', left:x+'px', top:y+'px',
        fontFamily:"'Raleway','Arial Black',sans-serif",
        fontSize:'15px', fontWeight:'800',
        color:'#EDE0E6', textShadow:'0 0 8px rgba(212,104,130,0.9)',
        pointerEvents:'none', zIndex:'608',
        transform:'translate(-50%,-50%)',
        letterSpacing:'0.12em', lineHeight:'1',
      });
      document.body.appendChild(d);
      const angle = Math.random()*Math.PI*2, spd = 4+Math.random()*11;
      let vx=Math.cos(angle)*spd, vy=Math.sin(angle)*spd-3, px=x, py=y, lf=1;
      const step = () => {
        lf -= 0.026; if (lf <= 0) { d.remove(); return; }
        vy += 0.32; px += vx; py += vy;
        d.style.left    = px+'px';
        d.style.top     = py+'px';
        d.style.opacity = Math.max(0,lf)+'';
        d.style.fontSize = (15+(1-lf)*11)+'px';
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  /* ── PARTICLE RENDERING ─────────────────────────────────── */
  function tickParts() {
    if (!ctx) return;
    parts = parts.filter(p => p.life > 0);
    parts.forEach(p => {
      p.life -= p.dc;
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gv; p.vx *= 0.984; p.rot += p.rs;
      const a = Math.max(0, p.life);
      ctx.save(); ctx.globalAlpha = a;
      if (p.type === 'smoke') {
        ctx.fillStyle = `rgba(92,24,40,${a*0.32})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r*(1.45-p.life*0.45), 0, Math.PI*2);
        ctx.fill();
      } else if (p.type === 'spark') {
        ctx.strokeStyle = p.col; ctx.lineWidth = 1.6;
        ctx.shadowColor = p.col; ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x-p.vx*0.52, p.y-p.vy*0.52);
        ctx.stroke();
      } else if (p.type === 'rect') {
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 5;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      } else {
        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    });
  }

  /* ── UTILS ──────────────────────────────────────────────── */
  function mk(t)  { return document.createElement(t); }
  function S(el, obj) { Object.entries(obj).forEach(([k,v]) => (el.style[k] = v)); }
  function lerp(a,b,t) { return a + (b-a)*t; }

  window.addEventListener('resize', () => {
    if (cvs) { cvs.width = innerWidth; cvs.height = innerHeight; }
  });

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot);
  else
    boot();
})();
