/* ============================================================
   《我们的乐章》音频引擎 —— 全部声音由 Web Audio API 实时合成
   ------------------------------------------------------------
   mode = 'full'   整曲循环（15 个人的声音都在里面）
   mode = 'solo'   某一段谱子独响，整曲退后（音量压低）
   mode = 'finale' 十五枚音符全部点亮后的和弦
   ------------------------------------------------------------
   每个成员 = 一个音高 + 一种音色（见 members.js）。
   点亮某人后，他的音量在声部独奏中会被永久抬高一截。
   ============================================================ */

const AudioEngine = (() => {
  let ctx = null, master, comp, conv, wet, loopBus, soloBus;
  let mode = 'idle';            // idle | full | solo | finale
  let activeSection = -1;
  let step = 0, nextT = 0, timer = null;

  const BPM = 72;
  const STEP_DUR = 60 / BPM / 2;          // 八分音符
  const FULL_LEN = 64;                    // 8 小节
  const SOLO_LEN = 16;                    // 2 小节

  /* 音名 → 频率（支持 C3 / F#4 / Bb5 这类写法） */
  const NOTE_SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function noteFreq(name) {
    const m = /^([A-Ga-g])([#b♯♭]?)(\d)$/.exec((name || '').trim());
    if (!m) return null;
    let semi = NOTE_SEMI[m[1].toUpperCase()];
    if (m[2] === '#' || m[2] === '♯') semi += 1;
    if (m[2] === 'b' || m[2] === '♭') semi -= 1;
    const midi = 12 * (parseInt(m[3], 10) + 1) + semi;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /* 整曲（原编曲，按 3 声部 × 5 人谱写）：8 小节循环，[步, 成员编号, 时值(步), 力度] */
  const FULL_PATTERN_BASE = [
    // 1-2 小节 · C → Am 的底色
    [0, 0, 14, .68], [0, 5, 3, .55], [2, 7, 3, .50],
    [4, 9, 3, .50],  [4, 12, 2, .40], [6, 3, 2, .45],
    [8, 4, 8, .62],  [8, 9, 3, .50],  [10, 8, 2, .42],
    [12, 7, 4, .50], [12, 14, 2, .38], [14, 6, 2, .42],
    // 3-4 小节
    [16, 0, 14, .62], [16, 6, 3, .48], [18, 7, 3, .48], [18, 10, 2, .36],
    [20, 8, 3, .48],  [22, 2, 2, .42], [22, 13, 2, .34],
    [24, 3, 8, .60],  [24, 7, 3, .48], [26, 9, 2, .44],
    [28, 11, 2, .36], [28, 1, 4, .45], [30, 8, 2, .44],
    // 5-6 小节
    [32, 4, 8, .60],  [32, 9, 3, .50], [34, 12, 2, .36], [34, 7, 3, .46],
    [36, 2, 4, .42],  [38, 13, 2, .34],
    [40, 3, 8, .58],  [40, 8, 3, .46], [42, 10, 2, .36], [42, 6, 3, .44],
    [44, 14, 2, .32], [44, 1, 4, .40],
    // 7-8 小节
    [48, 0, 14, .64], [48, 5, 3, .50], [50, 12, 2, .36], [50, 7, 3, .46],
    [52, 11, 2, .34], [52, 9, 3, .46], [54, 2, 2, .40],
    [56, 3, 4, .58],  [56, 13, 2, .34], [58, 10, 2, .34],
    [60, 4, 4, .52],  [60, 14, 2, .34], [60, 6, 3, .44],
  ];

  /* 声部独奏（原编曲）：2 小节循环，同上格式 */
  const SOLO_PATTERNS_BASE = [
    [ // 低音声部 · 沉稳的根音线条
      [0, 0, 6, .70], [6, 2, 2, .50], [8, 3, 4, .62], [12, 4, 2, .50], [14, 1, 2, .46],
    ],
    [ // 中音声部 · 流动的主旋律
      [0, 5, 2, .55], [2, 7, 2, .50], [4, 9, 2, .50], [6, 9, 2, .52],
      [8, 8, 2, .50], [10, 7, 2, .48], [12, 6, 2, .46], [14, 5, 2, .50],
    ],
    [ // 高音声部 · 闪烁的铃
      [0, 12, 2, .45], [4, 14, 2, .40], [6, 13, 2, .40],
      [8, 10, 2, .42], [12, 11, 2, .38], [14, 12, 2, .40],
    ],
  ];

  /* ---- 名单映射：把原编曲按声部搬到任意人数的新名单上 ---- */
  let FULL_PATTERN = [];
  let SOLO_PATTERNS = [];
  let boosts = new Array(MEMBERS.length).fill(1);
  let SEC_START = [0, 5, 10], SEC_SIZE = [5, 5, 5];
  const OLD_START = [0, 5, 10];

  function rebuild(members) {
    const n = members.length;
    boosts = new Array(n).fill(1);

    SEC_SIZE = [0, 0, 0];
    members.forEach(m => SEC_SIZE[m.section]++);
    SEC_START = [0, SEC_SIZE[0], SEC_SIZE[0] + SEC_SIZE[1]];

    /* 老成员 mi → （声部 s，声部内序号 k）→ 新名单同声部的第 k%size 位 */
    const mapIdx = mi => {
      const s = mi < 5 ? 0 : mi < 10 ? 1 : 2;
      const k = mi - OLD_START[s];
      return SEC_START[s] + (k % Math.max(1, SEC_SIZE[s]));
    };

    FULL_PATTERN = [];
    const used = new Set();
    for (const ev of FULL_PATTERN_BASE) {
      const mi = mapIdx(ev[1]);
      FULL_PATTERN.push([ev[0], mi, ev[2], ev[3]]);
      used.add(mi);
    }
    /* 某个声部人数超过 5 时，没进主题的成员以轻音量补进空拍，保证每个人都有声音 */
    members.forEach((m, mi) => {
      if (used.has(mi)) return;
      const slot = ((mi - SEC_START[m.section]) + m.section * 3) % 8;
      FULL_PATTERN.push([(slot * 8 + 2 + m.section * 2) % 64, mi, 2, 0.38]);
    });

    SOLO_PATTERNS = SOLO_PATTERNS_BASE.map((pat, s) =>
      pat.map(ev => {
        const k = ev[1] - OLD_START[s];
        return [ev[0], SEC_START[s] + (k % Math.max(1, SEC_SIZE[s])), ev[2], ev[3]];
      })
    );

    if (ctx && mode !== 'idle') startFull();
  }
  rebuild(MEMBERS);

  function init() {
    if (ctx) { ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.ratio.value = 4;
    comp.connect(ctx.destination);

    master = ctx.createGain(); master.gain.value = 0.85;
    master.connect(comp);

    conv = ctx.createConvolver();
    conv.buffer = makeImpulse(2.8, 2.4);
    wet = ctx.createGain(); wet.gain.value = 0.32;
    master.connect(conv); conv.connect(wet); wet.connect(comp);

    loopBus = ctx.createGain(); loopBus.gain.value = 0; loopBus.connect(master);
    soloBus = ctx.createGain(); soloBus.gain.value = 0; soloBus.connect(master);

    nextT = ctx.currentTime + 0.1;
    timer = setInterval(schedule, 40);
  }

  /* 用白噪声生成混响脉冲响应 */
  function makeImpulse(dur, decay) {
    const rate = ctx.sampleRate, len = Math.floor(rate * dur);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  /* 一个成员的声音：主振荡 + 高八度微光 + 低通 + 包络 */
  const VALID_WAVES = ['sine', 'triangle', 'sawtooth', 'square'];
  function voice(mi, t, dur, vel, bus) {
    const m = MEMBERS[mi], tb = m.timbre;
    const f = noteFreq(m.pitch) || 261.63;
    vel = Math.min(1, vel);
    const wave = VALID_WAVES.includes(tb.wave) ? tb.wave : 'sine';

    const g = ctx.createGain(); g.gain.value = 0;
    const flt = ctx.createBiquadFilter();
    flt.type = 'lowpass'; flt.frequency.value = tb.cutoff; flt.Q.value = 0.6;
    flt.connect(g); g.connect(bus);

    const o1 = ctx.createOscillator();
    o1.type = wave; o1.frequency.value = f;
    o1.detune.value = (mi % 2 ? 4 : -4);
    o1.connect(flt); o1.start(t);

    const o2 = ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = f * 2;
    const g2 = ctx.createGain(); g2.gain.value = 0.15;
    o2.connect(g2); g2.connect(flt); o2.start(t);

    const a = 0.02, rel = 0.4, end = t + Math.max(dur, 0.25);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel * tb.vol, t + a);
    g.gain.setTargetAtTime(vel * tb.vol * 0.45, t + a, Math.max(dur, 0.25) * 0.3);
    g.gain.setTargetAtTime(0.0001, end, rel);
    o1.stop(end + rel * 6); o2.stop(end + rel * 6);
  }

  /* 终章：C2 低音涌起 */
  function subSwell(t) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 65.41;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 1.8);
    g.gain.setTargetAtTime(0.0001, t + 7, 1.2);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 11);
  }

  /* 终章：十五枚音符依次落下，滚成一个和弦（力度按声部递减） */
  function rolledChord(t, baseVel) {
    const secVel = [0.8, 0.6, 0.5];
    MEMBERS.forEach((m, i) => voice(i, t + i * 0.07, 9, baseVel * secVel[m.section], master));
    subSwell(t + 0.2);
  }

  /* 前瞻式调度器：每 40ms 把未来 180ms 内的事件排进音频线程 */
  function schedule() {
    if (mode === 'idle') return;
    /* 标签页被挂起后 nextT 会落后，追赶而不是补播 */
    if (nextT < ctx.currentTime - 0.25) nextT = ctx.currentTime + 0.05;
    while (nextT < ctx.currentTime + 0.18) {
      if (mode === 'full') {
        const s = step % FULL_LEN;
        for (const ev of FULL_PATTERN) {
          if (ev[0] === s) voice(ev[1], nextT, ev[2] * STEP_DUR, ev[3], loopBus);
        }
      } else if (mode === 'solo') {
        const s = step % SOLO_LEN;
        for (const ev of SOLO_PATTERNS[activeSection]) {
          if (ev[0] === s) voice(ev[1], nextT, ev[2] * STEP_DUR, ev[3] * boosts[ev[1]], soloBus);
        }
      } else if (mode === 'finale') {
        const s = step % 32;
        if (s === 0) rolledChord(nextT, 0.62);
        if (s === 16) {
          const midStart = SEC_START[1];
          for (let k = 0; k < Math.min(3, SEC_SIZE[1]); k++) {
            const mi = midStart + k;
            if (mi < MEMBERS.length) voice(mi, nextT + k * 0.03, 6, 0.26, master);
          }
        }
        if (s % 4 === 2) {
          const hi = SEC_START[2] + Math.floor(Math.random() * Math.max(1, SEC_SIZE[2]));
          if (hi < MEMBERS.length) voice(hi, nextT, 2.5, 0.15 * boosts[hi], master);
        }
      }
      step++; nextT += STEP_DUR;
    }
  }

  function startFull() {
    if (!ctx) return;
    ctx.resume();
    mode = 'full'; step = 0; nextT = ctx.currentTime + 0.08;
    const now = ctx.currentTime;
    loopBus.gain.setTargetAtTime(0.9, now, 0.5);
    soloBus.gain.setTargetAtTime(0, now, 0.3);
  }

  function solo(section) {
    if (!ctx) return;
    ctx.resume();
    mode = 'solo'; activeSection = section; step = 0;
    const now = ctx.currentTime;
    loopBus.gain.setTargetAtTime(0.07, now, 0.4);   // 整曲退后
    soloBus.gain.setTargetAtTime(0.95, now, 0.25);  // 这段谱子响起来
  }

  function returnFull() {
    if (!ctx) return;
    startFull();
  }

  /* 点击单个音符：立刻响一声更亮的 */
  function accent(mi) {
    if (!ctx) return;
    ctx.resume();
    const bus = (mode === 'full') ? loopBus : (mode === 'solo' ? soloBus : master);
    voice(mi, ctx.currentTime + 0.02, 2.4, 0.85 * boosts[mi], bus);
  }

  /* 点亮：这个人的声音从此被抬高一截 */
  function lightUp(mi) { boosts[mi] = 1.65; }

  function finale() {
    if (!ctx) return;
    mode = 'finale'; step = 1;   // 跳过调度器 s=0，避免与下面的直接和弦叠两次
    const now = ctx.currentTime;
    nextT = now + 0.15;
    loopBus.gain.setTargetAtTime(0, now, 0.3);
    soloBus.gain.setTargetAtTime(0, now, 0.3);
    rolledChord(now + 0.18, 0.72);
  }

  function reset() {
    boosts.fill(1);
    if (ctx) startFull(); else mode = 'idle';
  }

  return { init, startFull, solo, returnFull, accent, lightUp, finale, reset, rebuild, noteFreq };
})();
