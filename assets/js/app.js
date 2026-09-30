/* App : rendu des notions, exercices (QCM + questions ouvertes), progression, thème, navigation. */
(function () {
  'use strict';

  const { esc } = window.H;
  const Course = window.Course;
  const STORE_KEY = 'olapApex.progress.v1';
  const THEME_KEY = 'olapApex.theme';
  const PARTS = {
    olap: { label: 'OLAP', title: 'Partie 1 · OLAP & modélisation décisionnelle' },
    apex: { label: 'APEX', title: 'Partie 2 · Oracle APEX' }
  };

  /* ---------- Stockage (toujours protégé : navigation privée, stockage bloqué…) ---------- */
  function load(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage indisponible : on continue sans */ }
  }
  let state = load(STORE_KEY, null) || { qcm: {}, open: {} };
  state.qcm = state.qcm || {};
  state.open = state.open || {};
  let saveTimer = null;
  function persist(now) {
    clearTimeout(saveTimer);
    if (now) save(STORE_KEY, state);
    else saveTimer = setTimeout(() => save(STORE_KEY, state), 300);
  }

  const notions = Course.notions;
  const byPart = p => notions.filter(n => n.part === p);
  const exoId = (n, i) => n.id + '-e' + (i + 1);
  const LVL = { 'Débutant': 'lvl-1', 'Débutant → Intermédiaire': 'lvl-2', 'Intermédiaire': 'lvl-2' };

  /* ---------- Rendu des exercices ---------- */
  function renderQcm(ex, id, label) {
    const opts = ex.options.map((o, k) =>
      '<label class="opt" for="' + id + '-o' + k + '"><input type="radio" name="' + id + '" id="' + id + '-o' + k + '" value="' + k + '"><span>' + o + '</span></label>'
    ).join('');
    return '<div class="exo" data-exo="' + id + '" data-kind="qcm">' +
      '<div class="exo-top"><span class="kind">' + label + ' · QCM</span><span class="state"></span></div>' +
      '<div class="q">' + ex.q + '</div>' +
      '<div class="opts" role="radiogroup">' + opts + '</div>' +
      '<div class="actions">' +
        '<button class="btn primary" type="button" data-act="check" disabled>Valider ma réponse</button>' +
        '<button class="btn ghost" type="button" data-act="reveal">Voir la correction</button>' +
        '<button class="btn ghost" type="button" data-act="retry" hidden>Réessayer</button>' +
      '</div>' +
      '<div class="feedback" hidden></div>' +
    '</div>';
  }

  function renderOpen(ex, id, label) {
    const crit = (ex.criteria || []).map(c => '<li>' + c + '</li>').join('');
    return '<div class="exo" data-exo="' + id + '" data-kind="open">' +
      '<div class="exo-top"><span class="kind">' + label + ' · Question ouverte</span><span class="state"></span></div>' +
      '<div class="q">' + ex.q + '</div>' +
      (ex.hint ? '<p class="hint"><b>Piste :</b> ' + ex.hint + '</p>' : '') +
      '<label class="sr-only" for="ta-' + id + '">Votre réponse</label>' +
      '<textarea id="ta-' + id + '" data-ta="' + id + '" placeholder="Rédigez votre réponse ici. Elle reste enregistrée dans ce navigateur."></textarea>' +
      '<div class="actions"><button class="btn primary" type="button" data-act="show">Voir la correction</button></div>' +
      '<div class="feedback" hidden>' +
        '<div class="model"><b>Correction proposée</b>' + ex.answer + '</div>' +
        (crit ? '<div class="criteria"><b>Points clés attendus</b><ul>' + crit + '</ul></div>' : '') +
        '<div class="selfeval"><span>Auto-évaluation :</span>' +
          '<button class="btn" type="button" data-self="ok">Je l\'avais</button>' +
          '<button class="btn" type="button" data-self="mid">En partie</button>' +
          '<button class="btn" type="button" data-self="bad">À revoir</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderExercises(list, idOf) {
    return list.map((ex, i) => {
      const id = idOf(i);
      const label = 'Exercice ' + (i + 1);
      return ex.type === 'qcm' ? renderQcm(ex, id, label) : renderOpen(ex, id, label);
    }).join('');
  }

  /* ---------- Rendu d'une notion ---------- */
  function renderNotion(n, idx, list) {
    const part = PARTS[n.part];
    const prev = list[idx - 1];
    const next = list[idx + 1] || (n.part === 'olap' ? byPart('apex')[0] : null);
    const objectives = (n.objectives || []).map(o => '<li>' + o + '</li>').join('');
    const keypoints = (n.keypoints || []).map(k => '<li>' + k + '</li>').join('');
    return '<section class="notion part-' + n.part + '" id="' + n.id + '" data-notion="' + n.id + '">' +
      '<header class="notion-head">' +
        '<div class="eyebrow"><span>' + part.label + ' · Notion ' + (idx + 1) + ' / ' + list.length + '</span>' +
          '<span class="chip ' + (LVL[n.level] || '') + '">' + n.level + '</span>' +
          '<span class="chip">' + n.duration + '</span></div>' +
        '<h2>' + n.title + '</h2>' +
        '<p class="intro">' + n.intro + '</p>' +
      '</header>' +
      (objectives ? '<div class="objectives"><h4>Objectifs</h4><ul>' + objectives + '</ul></div>' : '') +
      '<div class="prose">' + n.content + '</div>' +
      (keypoints ? '<div class="keypoints"><h4>À retenir</h4><ul>' + keypoints + '</ul></div>' : '') +
      '<div class="exercises">' +
        '<div class="ex-head"><h3>Exercices · ' + n.short + '</h3><span class="tally" data-tally="' + n.id + '"></span></div>' +
        renderExercises(n.exercises, i => exoId(n, i)) +
      '</div>' +
      '<nav class="notion-foot" aria-label="Navigation entre notions">' +
        (prev ? '<a href="#' + prev.id + '">← ' + prev.short + '</a>' : '<span></span>') +
        (next ? '<a href="#' + next.id + '">' + next.short + ' →</a>' : '<a href="#examen">Examen final →</a>') +
      '</nav>' +
    '</section>';
  }

  function renderPartHead(p) {
    const info = Course.extras.parts && Course.extras.parts[p];
    return '<header class="part-head part-' + p + '" id="partie-' + p + '">' +
      '<span class="tag">' + PARTS[p].title.split(' · ')[0] + '</span>' +
      '<h2>' + PARTS[p].title.split(' · ')[1] + '</h2>' +
      (info ? '<p>' + info + '</p>' : '') +
    '</header>';
  }

  /* ---------- Extras : examen, mémo, glossaire, ressources ---------- */
  function renderExtras() {
    const X = Course.extras;
    let html = '';
    if (X.exam) {
      html += '<section class="notion part-extra" id="examen">' +
        '<header class="notion-head"><div class="eyebrow"><span>Bilan</span><span class="chip">' + X.exam.length + ' questions</span></div>' +
        '<h2>Examen final OLAP + APEX</h2><p class="intro">Des questions qui mélangent les deux parties. Visez 10/12 avant de passer à un projet réel.</p></header>' +
        '<div class="exam-result" id="exam-result"></div>' +
        '<div class="exercises">' + renderExercises(X.exam.map(q => Object.assign({ type: 'qcm' }, q)), i => 'exam-' + (i + 1)) + '</div>' +
      '</section>';
    }
    if (X.memo) {
      html += '<section class="notion part-extra" id="memo"><header class="notion-head"><div class="eyebrow"><span>Aide-mémoire</span></div>' +
        '<h2>Mémo express</h2><p class="intro">Les syntaxes à garder sous la main.</p></header>' +
        '<div class="memo">' + X.memo + '</div></section>';
    }
    if (X.glossary) {
      html += '<section class="notion part-extra" id="glossaire"><header class="notion-head"><div class="eyebrow"><span>Vocabulaire</span><span class="chip">' + X.glossary.length + ' termes</span></div>' +
        '<h2>Glossaire</h2></header>' +
        '<div class="prose" style="margin-top:0"><label class="sr-only" for="gloss-search">Filtrer le glossaire</label>' +
        '<input class="search" id="gloss-search" type="search" placeholder="Filtrer : cube, SCD, session state…">' +
        '<dl class="gloss" id="gloss-list"></dl></div></section>';
    }
    if (X.resources) {
      html += '<section class="notion part-extra" id="ressources"><header class="notion-head"><div class="eyebrow"><span>Pour aller plus loin</span></div>' +
        '<h2>Ressources</h2></header><div class="resources">' +
        X.resources.map(r => '<a href="' + r.url + '" target="_blank" rel="noopener"><b>' + r.title + '</b><span>' + r.desc + '</span></a>').join('') +
        '</div></section>';
    }
    return html;
  }

  function renderGlossary(filter) {
    const list = document.getElementById('gloss-list');
    if (!list) return;
    const f = (filter || '').trim().toLowerCase();
    const items = Course.extras.glossary
      .filter(g => !f || (g.term + ' ' + g.def).toLowerCase().includes(f))
      .sort((a, b) => a.term.localeCompare(b.term, 'fr'));
    list.innerHTML = items.length
      ? items.map(g => '<div><dt>' + g.term + '<small class="' + g.part + '">' + g.part.toUpperCase() + '</small></dt><dd>' + g.def + '</dd></div>').join('')
      : '<span class="empty">Aucun terme ne correspond à « ' + esc(filter) + ' ».</span>';
  }

  /* ---------- Rail (sommaire) + parcours de l'accueil ---------- */
  function renderRail() {
    const rail = document.getElementById('rail');
    let html = '';
    ['olap', 'apex'].forEach(p => {
      html += '<div class="part-' + p + '"><h3>' + PARTS[p].title.split(' · ')[0] + ' · ' + PARTS[p].label + ' <span class="pct" data-pct="' + p + '"></span></h3><ol>' +
        byPart(p).map((n, i) =>
          '<li><a href="#' + n.id + '" data-link="' + n.id + '"><span class="num" data-num="' + n.id + '">' + (i + 1) + '</span><span>' + n.short + '</span><span class="score" data-score="' + n.id + '"></span></a></li>'
        ).join('') + '</ol></div>';
    });
    html += '<div class="part-extra"><h3>Bilan & outils</h3><ul>' +
      [['examen', 'Examen final'], ['memo', 'Mémo express'], ['glossaire', 'Glossaire'], ['ressources', 'Ressources']]
        .filter(([id]) => document.getElementById(id))
        .map(([id, t]) => '<li><a href="#' + id + '" data-link="' + id + '"><span class="num">·</span><span>' + t + '</span><span></span></a></li>').join('') +
      '</ul></div>' +
      '<button class="reset" type="button" id="reset-btn">Réinitialiser ma progression</button>' +
      '<div class="reset-confirm" id="reset-confirm" hidden><span>Effacer toutes vos réponses et scores ?</span>' +
      '<div class="row"><button class="btn primary part-apex" type="button" id="reset-yes">Oui, effacer</button><button class="btn" type="button" id="reset-no">Annuler</button></div></div>';
    rail.innerHTML = html;

    ['olap', 'apex'].forEach(p => {
      const ol = document.getElementById('path-' + p);
      if (ol) ol.innerHTML = byPart(p).map(n => '<li><a href="#' + n.id + '">' + n.title + '</a></li>').join('');
      const meta = document.getElementById('meta-' + p);
      if (meta) {
        const mins = byPart(p).reduce((s, n) => s + parseInt(n.duration, 10), 0);
        meta.textContent = byPart(p).length + ' notions · ' + byPart(p).length * 5 + ' exercices · environ ' + Math.round(mins / 6) / 10 + ' h';
      }
    });
  }

  /* ---------- Application de l'état sauvegardé à un exercice ---------- */
  function paintQcm(el, ex, rec) {
    const id = el.dataset.exo;
    const inputs = el.querySelectorAll('input[type=radio]');
    const labels = el.querySelectorAll('.opt');
    const fb = el.querySelector('.feedback');
    const st = el.querySelector('.state');
    const btnCheck = el.querySelector('[data-act=check]');
    const btnReveal = el.querySelector('[data-act=reveal]');
    const btnRetry = el.querySelector('[data-act=retry]');
    labels.forEach(l => l.classList.remove('right', 'wrong', 'chosen'));
    el.classList.remove('is-ok', 'is-bad');
    if (!rec) {
      inputs.forEach(i => { i.disabled = false; i.checked = false; });
      fb.hidden = true; st.textContent = ''; st.className = 'state';
      btnCheck.hidden = false; btnCheck.disabled = true; btnReveal.hidden = false; btnRetry.hidden = true;
      return;
    }
    inputs.forEach((inp, k) => {
      inp.disabled = true;
      inp.checked = rec.pick === k;
      if (k === ex.answer) labels[k].classList.add('right');
      else if (rec.pick === k) labels[k].classList.add('wrong');
    });
    const correct = rec.pick === ex.answer;
    const revealedOnly = rec.pick === null || rec.pick === undefined;
    fb.hidden = false;
    fb.className = 'feedback ' + (revealedOnly ? '' : (correct ? 'ok' : 'bad'));
    fb.innerHTML = '<b>' + (revealedOnly ? 'Correction' : (correct ? 'Bonne réponse' : 'Pas tout à fait')) + '</b>' +
      '<div>' + (revealedOnly || !correct ? 'La bonne réponse est : <strong>' + ex.options[ex.answer] + '</strong>. ' : '') + ex.explain + '</div>';
    st.textContent = revealedOnly ? 'Correction consultée' : (correct ? 'Réussi' : 'À revoir');
    st.className = 'state ' + (revealedOnly ? '' : (correct ? 'ok' : 'bad'));
    if (!revealedOnly) el.classList.add(correct ? 'is-ok' : 'is-bad');
    btnCheck.hidden = true; btnReveal.hidden = true; btnRetry.hidden = false;
    if (id.indexOf('exam-') === 0) updateExam();
  }

  function paintOpen(el, rec) {
    const fb = el.querySelector('.feedback');
    const st = el.querySelector('.state');
    const btn = el.querySelector('[data-act=show]');
    const ta = el.querySelector('textarea');
    if (rec && typeof rec.text === 'string' && ta.value !== rec.text) ta.value = rec.text;
    const shown = !!(rec && rec.shown);
    fb.hidden = !shown;
    btn.textContent = shown ? 'Masquer la correction' : 'Voir la correction';
    el.querySelectorAll('[data-self]').forEach(b => {
      b.className = 'btn' + (rec && rec.self === b.dataset.self ? ' on-' + b.dataset.self : '');
    });
    const self = rec && rec.self;
    st.textContent = self === 'ok' ? 'Maîtrisé' : self === 'mid' ? 'Partiellement' : self === 'bad' ? 'À revoir' : (shown ? 'Correction consultée' : '');
    st.className = 'state ' + (self === 'ok' ? 'ok' : self === 'bad' ? 'bad' : '');
  }

  function findExercise(id) {
    if (id.indexOf('exam-') === 0) {
      const q = Course.extras.exam[parseInt(id.slice(5), 10) - 1];
      return q ? Object.assign({ type: 'qcm' }, q) : null;
    }
    const m = id.match(/^(.*)-e(\d+)$/);
    const n = m && notions.find(x => x.id === m[1]);
    return n ? n.exercises[parseInt(m[2], 10) - 1] : null;
  }

  /* ---------- Progression ---------- */
  function notionStats(n) {
    let qcmOk = 0, qcmDone = 0, qcmTotal = 0, openDone = 0, openTotal = 0;
    n.exercises.forEach((ex, i) => {
      const id = exoId(n, i);
      if (ex.type === 'qcm') {
        qcmTotal++;
        const r = state.qcm[id];
        if (r) { qcmDone++; if (r.pick === ex.answer) qcmOk++; }
      } else {
        openTotal++;
        const r = state.open[id];
        if (r && (r.shown || r.self)) openDone++;
      }
    });
    return { qcmOk, qcmDone, qcmTotal, openDone, openTotal, done: qcmDone + openDone, total: qcmTotal + openTotal };
  }

  function updateProgress() {
    let all = 0, doneOlap = 0, doneApex = 0;
    notions.forEach(n => {
      const s = notionStats(n);
      all += s.total;
      if (n.part === 'olap') doneOlap += s.done; else doneApex += s.done;
      const tally = document.querySelector('[data-tally="' + n.id + '"]');
      if (tally) tally.textContent = 'QCM ' + s.qcmOk + '/' + s.qcmTotal + ' justes · ' + s.done + '/' + s.total + ' faits';
      const score = document.querySelector('[data-score="' + n.id + '"]');
      if (score) score.textContent = s.done ? s.done + '/' + s.total : '';
      const num = document.querySelector('[data-num="' + n.id + '"]');
      if (num) num.classList.toggle('done', s.done === s.total);
    });
    ['olap', 'apex'].forEach(p => {
      const tot = byPart(p).reduce((s, n) => s + n.exercises.length, 0);
      const d = p === 'olap' ? doneOlap : doneApex;
      const el = document.querySelector('[data-pct="' + p + '"]');
      if (el) el.textContent = tot ? Math.round(d / tot * 100) + ' %' : '';
    });
    const bo = document.getElementById('bar-olap');
    const ba = document.getElementById('bar-apex');
    if (bo) bo.style.width = (all ? doneOlap / all * 100 : 0) + '%';
    if (ba) ba.style.width = (all ? doneApex / all * 100 : 0) + '%';
    const txt = document.getElementById('progress-text');
    if (txt) txt.textContent = (doneOlap + doneApex) + ' / ' + all;
  }

  function updateExam() {
    const box = document.getElementById('exam-result');
    const exam = Course.extras.exam;
    if (!box || !exam) return;
    let done = 0, ok = 0;
    exam.forEach((q, i) => {
      const r = state.qcm['exam-' + (i + 1)];
      if (r) { done++; if (r.pick === q.answer) ok++; }
    });
    let verdict = 'Répondez aux questions : le score se met à jour à chaque validation.';
    if (done === exam.length) {
      const pct = ok / exam.length;
      verdict = pct >= .83 ? 'Excellent : vous avez le niveau intermédiaire visé. Passez au projet fil rouge en conditions réelles.'
        : pct >= .6 ? 'Bon niveau. Relisez les notions des questions ratées puis retentez.'
        : 'Reprenez les notions correspondantes (liens dans le sommaire) et refaites leurs exercices.';
    }
    box.innerHTML = '<span class="big">' + ok + ' / ' + exam.length + '</span><span>' + done + ' question(s) traitée(s). ' + verdict + '</span>';
  }

  /* ---------- Interactions ---------- */
  function bindExercises(root) {
    root.addEventListener('change', e => {
      const inp = e.target;
      if (inp.type !== 'radio') return;
      const exo = inp.closest('.exo');
      exo.querySelectorAll('.opt').forEach(l => l.classList.toggle('chosen', l.contains(inp)));
      exo.querySelector('[data-act=check]').disabled = false;
    });

    root.addEventListener('input', e => {
      const ta = e.target.closest('textarea[data-ta]');
      if (!ta) return;
      const id = ta.dataset.ta;
      state.open[id] = Object.assign({}, state.open[id], { text: ta.value });
      persist();
    });

    root.addEventListener('click', e => {
      const copy = e.target.closest('.code .copy');
      if (copy) return copyCode(copy);

      const btn = e.target.closest('[data-act], [data-self]');
      if (!btn) return;
      const exo = btn.closest('.exo');
      if (!exo) return;
      const id = exo.dataset.exo;
      const ex = findExercise(id);
      if (!ex) return;
      const act = btn.dataset.act;

      if (act === 'check') {
        const picked = exo.querySelector('input[type=radio]:checked');
        if (!picked) return;
        state.qcm[id] = { pick: parseInt(picked.value, 10) };
        paintQcm(exo, ex, state.qcm[id]);
      } else if (act === 'reveal') {
        state.qcm[id] = { pick: null };
        paintQcm(exo, ex, state.qcm[id]);
      } else if (act === 'retry') {
        delete state.qcm[id];
        paintQcm(exo, ex, null);
        if (id.indexOf('exam-') === 0) updateExam();
      } else if (act === 'show') {
        const rec = Object.assign({}, state.open[id]);
        rec.shown = !rec.shown;
        state.open[id] = rec;
        paintOpen(exo, rec);
      } else if (btn.dataset.self) {
        const rec = Object.assign({}, state.open[id], { shown: true });
        rec.self = rec.self === btn.dataset.self ? null : btn.dataset.self;
        state.open[id] = rec;
        paintOpen(exo, rec);
      }
      persist(true);
      updateProgress();
    });
  }

  function copyCode(btn) {
    const codeEl = btn.parentElement.querySelector('code');
    const text = codeEl.textContent;
    const done = ok => {
      btn.textContent = ok ? 'Copié' : 'Sélectionné';
      setTimeout(() => { btn.textContent = 'Copier'; }, 1600);
    };
    const selectFallback = () => {
      const r = document.createRange();
      r.selectNodeContents(codeEl);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(r);
      done(false);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), selectFallback);
      else selectFallback();
    } catch (e) { selectFallback(); }
  }

  function restoreAll() {
    document.querySelectorAll('.exo').forEach(el => {
      const id = el.dataset.exo;
      if (el.dataset.kind === 'qcm') {
        const rec = state.qcm[id];
        if (rec) paintQcm(el, findExercise(id), rec);
      } else {
        paintOpen(el, state.open[id]);
      }
    });
    updateExam();
    updateProgress();
  }

  /* ---------- Thème : système → clair → sombre ---------- */
  const THEME_ICONS = {
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  };
  const THEME_LABEL = { system: 'Thème : système', light: 'Thème : clair', dark: 'Thème : sombre' };
  function applyTheme(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
    const btn = document.getElementById('theme-btn');
    if (btn) { btn.innerHTML = THEME_ICONS[t] || THEME_ICONS.system; btn.title = THEME_LABEL[t]; btn.setAttribute('aria-label', THEME_LABEL[t]); }
  }

  /* ---------- Démarrage ---------- */
  function start() {
    const main = document.getElementById('content');
    let html = '';
    ['olap', 'apex'].forEach(p => {
      const list = byPart(p);
      html += renderPartHead(p) + list.map((n, i) => renderNotion(n, i, list)).join('');
    });
    html += renderExtras();
    main.insertAdjacentHTML('beforeend', '<div class="col">' + html + '<footer class="site-foot">OLAP &amp; APEX Training · contenu pédagogique libre de réutilisation · progression stockée localement dans votre navigateur.</footer></div>');
    renderRail();
    renderGlossary('');
    // Composants interactifs propres à une notion (ex. laboratoire du cube)
    notions.forEach(n => {
      if (typeof n.mount !== 'function') return;
      try { n.mount(document.getElementById(n.id)); } catch (e) { console.error(n.id, e); }
    });
    bindExercises(document.body);
    restoreAll();

    const gs = document.getElementById('gloss-search');
    if (gs) gs.addEventListener('input', () => renderGlossary(gs.value));

    // Thème
    let theme = load(THEME_KEY, 'system');
    applyTheme(theme);
    document.getElementById('theme-btn').addEventListener('click', () => {
      theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
      applyTheme(theme);
      save(THEME_KEY, theme);
    });

    // Menu mobile
    const rail = document.getElementById('rail');
    const menuBtn = document.getElementById('menu-btn');
    menuBtn.addEventListener('click', () => {
      const open = rail.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    rail.addEventListener('click', e => {
      if (e.target.closest('a')) { rail.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });

    // Réinitialisation (confirmation dans la page, pas de confirm())
    const rb = document.getElementById('reset-btn');
    const rc = document.getElementById('reset-confirm');
    rb.addEventListener('click', () => { rc.hidden = false; rb.hidden = true; });
    document.getElementById('reset-no').addEventListener('click', () => { rc.hidden = true; rb.hidden = false; });
    document.getElementById('reset-yes').addEventListener('click', () => {
      state = { qcm: {}, open: {} };
      persist(true);
      document.querySelectorAll('.exo').forEach(el => {
        if (el.dataset.kind === 'qcm') paintQcm(el, findExercise(el.dataset.exo), null);
        else { el.querySelector('textarea').value = ''; paintOpen(el, null); }
      });
      updateExam(); updateProgress();
      rc.hidden = true; rb.hidden = false;
    });

    // Sommaire : section active
    const links = new Map();
    document.querySelectorAll('[data-link]').forEach(a => links.set(a.dataset.link, a));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          links.forEach(a => a.classList.remove('active'));
          const a = links.get(en.target.id);
          if (a) {
            a.classList.add('active');
            const r = rail.getBoundingClientRect(), b = a.getBoundingClientRect();
            if (b.top < r.top || b.bottom > r.bottom) rail.scrollTop += b.top - r.top - r.height / 2;
          }
        });
      }, { rootMargin: '-30% 0px -65% 0px' });
      document.querySelectorAll('section.notion').forEach(s => io.observe(s));
    }

    // Lien direct (#olap-3…) : le contenu est injecté après le chargement, on re-scrolle
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
