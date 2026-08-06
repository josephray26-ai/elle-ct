// Landing page: the hero demo is a real drill, so the first thing a visitor
// does is the thing the product does. Original questions written for the demo.

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const DEMO = [
  {
    subject: 'English', source: 'Punctuation · #14',
    stem: 'The bus, which Ruth has driven for nineteen years reaches neighborhoods the main branch never served.',
    choices: [
      { l: 'A', t: 'NO CHANGE' },
      { l: 'B', t: 'years, reaches' },
      { l: 'C', t: 'years; reaches' },
      { l: 'D', t: 'years reaches,' },
    ],
    answer: 'B',
    why: '**Commas come in pairs.** "which Ruth has driven for nineteen years" is an interruption, so it needs a comma on both sides — there is already one before *which*, so the closing one has to go after *years*.',
    traps: {
      A: 'You left the interrupting phrase with an opening comma and no closing one. A lone comma around a phrase is almost always wrong.',
      C: 'A semicolon needs a complete sentence on both sides. "reaches neighborhoods the main branch never served" cannot stand alone.',
      D: 'That comma splits the verb from its object. Nothing interrupts there, so nothing belongs there.',
    },
  },
  {
    subject: 'Math', source: 'Algebra · #31',
    stem: 'If 4(x − 3) = 2x + 10, what is the value of 3x?',
    choices: [
      { l: 'F', t: '11' },
      { l: 'G', t: '22' },
      { l: 'H', t: '33' },
      { l: 'J', t: '36' },
      { l: 'K', t: '44' },
    ],
    answer: 'H',
    why: '**Answer the question asked.** 4x − 12 = 2x + 10 → 2x = 22 → x = 11. The question wants 3x, which is 33.',
    traps: {
      F: 'That is x, not 3x. The ACT puts the value you solved for on the page on purpose — it is the most common Math miss there is.',
      G: 'That is 2x. Reread the last line of the question before you pick.',
      J: 'Check the arithmetic: 2x = 22, not 24.',
      K: 'That is 4x. Circle what the question actually asks for before you start solving.',
    },
  },
  {
    subject: 'Reading', source: 'Inference · #7',
    stem: 'Ruth keeps no formal schedule for what she brings. She watches what leaves the shelves and restocks accordingly.\n\nThe passage most strongly suggests that Ruth:',
    choices: [
      { l: 'A', t: 'resents the county library board.' },
      { l: 'B', t: 'lets the readers decide what the bus carries.' },
      { l: 'C', t: 'has memorized the entire catalog.' },
      { l: 'D', t: 'plans her routes a year in advance.' },
    ],
    answer: 'B',
    why: '**ACT inferences are small.** She watches what gets borrowed and restocks to match — that is one short step from the text, and it is the whole answer.',
    traps: {
      A: 'Nothing in the passage mentions the board or any resentment. If you cannot point to the line, it is a guess.',
      C: 'Overreach. Watching what leaves the shelves is not the same as memorizing a catalog — extreme claims are usually the trap.',
      D: 'The passage says the opposite: she keeps no formal schedule.',
    },
  },
];

const md = (t) => esc(t)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');

let idx = 0, answered = false;

function render() {
  const q = DEMO[idx];
  answered = false;
  $('#demoSubject').textContent = q.subject;
  $('#demoSource').textContent = q.source;
  $('#demoProgress').textContent = `${idx + 1} / ${DEMO.length}`;
  $('#demoStem').textContent = q.stem;
  $('#demoChoices').innerHTML = q.choices.map(c =>
    `<button class="demo-choice" data-l="${c.l}">
       <span class="ltr">${c.l}</span><span>${esc(c.t)}</span>
     </button>`).join('');
  $('#demoChoices').querySelectorAll('.demo-choice')
    .forEach(b => b.addEventListener('click', () => answer(b.dataset.l)));
  const fb = $('#demoFeedback');
  fb.hidden = true; fb.innerHTML = '';
  $('#demoNext').hidden = true;
  $('#demoHint').textContent = 'Pick an answer — this one is live.';
}

function answer(letter) {
  if (answered) return;
  answered = true;
  const q = DEMO[idx];
  const right = letter === q.answer;

  $('#demoChoices').querySelectorAll('.demo-choice').forEach(b => {
    b.disabled = true;
    if (b.dataset.l === q.answer) b.classList.add('correct');
    else if (b.dataset.l === letter) b.classList.add('wrong');
  });

  const fb = $('#demoFeedback');
  fb.hidden = false;
  fb.innerHTML = right
    ? `<span class="lbl">Correct</span>${md(q.why)}`
    : `<span class="lbl">Why ${q.answer} is right</span>${md(q.why)}
       <p style="margin-top:10px"><b>Your answer, ${letter}:</b> ${md(q.traps[letter] || '')}</p>`;

  $('#demoHint').textContent = right ? 'That is the idea.' : 'This is what every miss looks like in the app.';
  const next = $('#demoNext');
  next.hidden = idx >= DEMO.length - 1;
  if (idx >= DEMO.length - 1) $('#demoHint').innerHTML = 'That is the whole loop. <a href="app.html#import">Import your own test →</a>';
}

$('#demoNext').addEventListener('click', () => { idx++; render(); });
render();

// ---- nav hairline once you scroll past the hero ----
const nav = $('#lnav');
const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- reveal on scroll + animate the mini bars when they come into view ----
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fillBars = (root) => root.querySelectorAll('.fill[data-w]')
  .forEach(el => { el.style.width = el.dataset.w + '%'; });

const revealAll = () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  fillBars(document);
};

if (reduced || !('IntersectionObserver' in window)) {
  revealAll();
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      fillBars(e.target);
      io.unobserve(e.target);
    }
  }, {
    // Reveal a screen early rather than on entry: a fast flick can outrun the
    // observer, and a blank card is worse than an un-animated one.
    rootMargin: '0px 0px 300px 0px',
    threshold: 0,
  });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Belt and braces — nothing stays invisible, whatever the observer does.
  setTimeout(revealAll, 2500);
  addEventListener('pagehide', revealAll);
}
