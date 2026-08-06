// Turns raw ACT text (from a PDF, a paste, a scan-to-text) into structured questions.
// Deliberately forgiving: PDF text extraction is messy, so every rule has a fallback.

const LETTERS = 'ABCDEFGHJK';
const JUNK = [
  /^\s*go on to the next page/i,
  /^\s*do your figuring here/i,
  /^\s*end of test/i,
  /^\s*stop!? if you finish/i,
  /^\s*act[-–]?\s?\d{2,4}[a-z]?\s*$/i,
  /^\s*\d{1,3}\s*$/,                      // stray page numbers
  /^\s*(page\s+)?\d{1,3}\s*\|\s*/i,
  /^\s*copyright|^\s*©/i,
];

const isJunk = (line) => JUNK.some(re => re.test(line));
const QSTART = /^\s{0,6}\(?(\d{1,3})\s*[.):]\s+(\S.*)$/;
const CHOICE = /^\s{0,8}\(?([A-K])\s*[.):]\s*(.*)$/;
const CHOICE_INLINE = /\(?\b([A-K])[.)]\s+/g;
const PASSAGE_HEAD = /^\s*(passage\s+[ivx\d]+[a-z]?)\b(.*)$/i;
const KEY_PAIR = /(\d{1,3})\s*[.):\-–]?\s*([A-K])\b/g;

const clean = (s) => s.replace(/[ \t]+/g, ' ').replace(/\s+\n/g, '\n').trim();

function normalize(raw) {
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(/\f/g, '\n')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, ' ')
    .replace(/-\n(?=[a-z])/g, '')          // de-hyphenate line-broken words
    .split('\n')
    .filter(l => !isJunk(l))
    .join('\n');
}

/** Answer key: "1. A  2. J  3. C" in any layout, including a column per line. */
export function parseKey(text) {
  const key = new Map();
  if (!text || !text.trim()) return key;
  let m;
  KEY_PAIR.lastIndex = 0;
  while ((m = KEY_PAIR.exec(text)) !== null) {
    const n = parseInt(m[1], 10);
    const letter = m[2].toUpperCase();
    if (!LETTERS.includes(letter) || letter === 'I') continue;
    if (n < 1 || n > 999) continue;
    if (!key.has(n)) key.set(n, letter);
  }
  return key;
}

/** Explanations laid out as "12. The correct answer is F because ..." */
export function parseExplanations(text) {
  const out = new Map();
  if (!text || !/correct answer|because|explanation/i.test(text)) return out;
  const lines = normalize(text).split('\n');
  let cur = null, buf = [];
  const flush = () => { if (cur !== null && buf.length) out.set(cur, clean(buf.join(' '))); };
  for (const line of lines) {
    const m = line.match(/^\s*\(?(\d{1,3})\s*[.):]\s+(.*)$/);
    if (m && /correct answer|the answer is|best answer/i.test(m[2])) {
      flush(); cur = parseInt(m[1], 10); buf = [m[2]];
    } else if (cur !== null) buf.push(line);
  }
  flush();
  return out;
}

function guessSubject(q, passageText = '') {
  const stem = (q.stem || '').toLowerCase();
  const all = (stem + ' ' + q.choices.map(c => c.text).join(' ')).toLowerCase();
  const ctx = passageText.toLowerCase();
  // English gives itself away either in the choices (NO CHANGE) or in the
  // rhetorical wording of the stem — check both before anything else.
  if (/no change/.test(all) || /omit the underlined/.test(all)) return 'English';
  if (/the writer|the essay|this paragraph|the preceding sentence|underlined portion/.test(stem)) return 'English';
  if (q.choices.length === 5) return 'Math';
  if (/which of the following|solve|equation|graph|triangle|\bx\s*=|integer|slope/.test(stem)
      && /[0-9=+\-*/^√π]/.test(q.choices.map(c => c.text).join(''))) return 'Math';
  // Science terms must appear in the question itself; a passage that merely
  // mentions a "table" is not a Science passage.
  if (/figure \d|table \d|trial \d|study \d|experiment \d|scientist \d|according to (figure|table)|data in/.test(stem)) return 'Science';
  if (/\b(figure|table|trial|hypothesis)\b/.test(stem) && /(figure|table|trial|experiment) \d/.test(ctx)) return 'Science';
  if (/passage|the author|the narrator|main idea|it can reasonably be inferred|as it is used in line/.test(stem)) return 'Reading';
  return 'English';
}

/** Auto-tag from the wording of the question — powers the "weak spots" drill. */
export function autoTags(q, subject) {
  const s = (q.stem + ' ' + q.choices.map(c => c.text).join(' ')).toLowerCase();
  const t = new Set();
  if (subject === 'English') {
    if (/,/.test(q.choices.map(c => c.text).join('')) && /no change/.test(s)) t.add('punctuation');
    if (/;|:|--|—/.test(q.choices.map(c => c.text).join(''))) t.add('semicolon-colon-dash');
    if (/\bwhich choice|most effectively|best accomplishes|most logical|relevant/.test(s)) t.add('rhetorical-skills');
    if (/should (the writer|this|that)|if the writer were to delete|essay/.test(s)) t.add('author-purpose');
    if (/most logical place|placement|sentence \d/.test(s)) t.add('organization');
    if (/redundant|wordy|concise/.test(s)) t.add('conciseness');
    // Only tag agreement/tense when the choices actually swap verb forms.
    const texts = q.choices.map(c => c.text.toLowerCase());
    const pairs = [['was','were'],['is','are'],['has','have'],['had','has'],['does','do'],['their','its']];
    if (pairs.some(([a, b]) => texts.some(t1 => new RegExp(`\\b${a}\\b`).test(t1)) &&
                               texts.some(t2 => new RegExp(`\\b${b}\\b`).test(t2)))) t.add('agreement-tense');
    if (texts.some(t1 => /\b(it's|its|they're|their|there|who's|whose)\b/.test(t1))) t.add('pronouns-apostrophes');
  } else if (subject === 'Math') {
    if (/triangle|angle|circle|radius|perimeter|area|parallel|degrees/.test(s)) t.add('geometry');
    if (/slope|line|coordinate|\(x, ?y\)|graph/.test(s)) t.add('coordinate-geometry');
    if (/probability|average|mean|median|mode|ratio|percent/.test(s)) t.add('stats-probability');
    if (/sin|cos|tan|trig/.test(s)) t.add('trigonometry');
    if (/equation|solve for|expression|factor|inequality|x\^?2|quadratic/.test(s)) t.add('algebra');
    if (/matrix|imaginary|logarithm|vector|sequence/.test(s)) t.add('advanced');
    if (/how many|total cost|per hour|if .* then/.test(s)) t.add('word-problem');
  } else if (subject === 'Reading') {
    if (/as it is used in line|most nearly means/.test(s)) t.add('vocab-in-context');
    if (/main idea|main purpose|primarily|as a whole/.test(s)) t.add('big-picture');
    if (/inferred|suggests|implies|most likely/.test(s)) t.add('inference');
    if (/according to the passage|states that|line \d+/.test(s)) t.add('detail');
    if (/compare|both passages|passage a|passage b/.test(s)) t.add('paired-passages');
  } else if (subject === 'Science') {
    if (/figure|table|graph/.test(s)) t.add('data-representation');
    if (/experiment|trial|study/.test(s)) t.add('research-summaries');
    if (/scientist \d|hypothesis|viewpoint|would (most likely )?agree/.test(s)) t.add('conflicting-viewpoints');
    if (/increase|decrease|trend|as .* increases/.test(s)) t.add('trends');
    if (/based on .* and .* knowledge|prior knowledge/.test(s)) t.add('outside-knowledge');
  }
  return [...t];
}

/**
 * Main entry. Returns { questions, passages, prompts, warnings }.
 * Numbers restart per section, so a detected "1." after "60." is treated as a new section.
 */
export function parseTest(raw, opts = {}) {
  const text = normalize(raw || '');
  const lines = text.split('\n');
  const warnings = [];

  // Writing prompt? Those have no choices at all.
  const promptHit = /write a unified, coherent essay|essay task|perspective (one|1)\b/i.test(text);

  const passages = [];
  const questions = [];
  let curPassage = null;
  let passageBuf = [];
  let cur = null;         // question under construction
  let lastNum = 0;
  let preBuf = [];        // text seen before the first question of a passage

  const flushPassage = () => {
    if (!passageBuf.length) return;
    const body = clean(passageBuf.join('\n'));
    if (body.length > 220) {                       // ignore stray fragments
      curPassage = { id: null, label: curPassage?.label || `Passage ${passages.length + 1}`, text: body };
      passages.push(curPassage);
    }
    passageBuf = [];
  };

  const flushQuestion = () => {
    if (!cur) return;
    cur.stem = clean(cur.stemLines.join(' '));
    cur.choices = cur.choices.filter(c => c.text.trim().length || c.letter);
    if (cur.stem && cur.choices.length >= 2) questions.push(cur);
    else if (cur.stem) warnings.push(`Question ${cur.number} had no answer choices — skipped.`);
    cur = null;
  };

  const looksLikeQuestionStart = (i, num) => {
    // Must have a choice line within the next handful of lines, and the number
    // must advance (or restart a section).
    if (!(num > lastNum || num === 1)) return false;
    for (let j = i + 1; j < Math.min(i + 14, lines.length); j++) {
      if (CHOICE.test(lines[j])) return true;
      if (QSTART.test(lines[j])) return false;
    }
    return false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { if (cur) cur.stemLines.push(''); else passageBuf.push(''); continue; }

    const ph = line.match(PASSAGE_HEAD);
    if (ph && !cur) {
      flushQuestion(); flushPassage();
      curPassage = { label: clean(ph[1] + ' ' + (ph[2] || '')) };
      passageBuf = [];
      lastNum = 0;
      continue;
    }

    const qs = line.match(QSTART);
    if (qs && looksLikeQuestionStart(i, parseInt(qs[1], 10))) {
      flushQuestion();
      if (passageBuf.length) flushPassage();
      lastNum = parseInt(qs[1], 10);
      cur = {
        number: lastNum,
        stemLines: [qs[2]],
        choices: [],
        passageIdx: passages.length ? passages.length - 1 : null,
      };
      continue;
    }

    const ch = line.match(CHOICE);
    if (cur && ch && LETTERS.includes(ch[1])) {
      const letter = ch[1];
      const already = cur.choices.some(c => c.letter === letter);
      if (!already) { cur.choices.push({ letter, text: clean(ch[2]) }); continue; }
    }

    if (cur) {
      // continuation of the last choice, or of the stem
      if (cur.choices.length) cur.choices[cur.choices.length - 1].text = clean(cur.choices.at(-1).text + ' ' + line);
      else cur.stemLines.push(line);
    } else {
      passageBuf.push(line);
    }
  }
  flushQuestion();
  if (passageBuf.length && !questions.length) preBuf = passageBuf;
  else flushPassage();

  // Second pass: choices crammed onto one line ("A. NO CHANGE B. having ran C. ...")
  for (const q of questions) {
    if (q.choices.length >= 2) continue;
    const line = q.stem;
    const hits = [...line.matchAll(CHOICE_INLINE)];
    if (hits.length >= 3) {
      q.stem = clean(line.slice(0, hits[0].index));
      q.choices = hits.map((h, k) => ({
        letter: h[1],
        text: clean(line.slice(h.index + h[0].length, k + 1 < hits.length ? hits[k + 1].index : line.length)),
      }));
    }
  }

  // Finish: subject, tags, passage links
  const forced = opts.subject && opts.subject !== 'auto' ? opts.subject : null;
  const out = questions
    .filter(q => q.choices.length >= 2)
    .map(q => {
      const ptext = q.passageIdx != null && passages[q.passageIdx] ? passages[q.passageIdx].text : '';
      const subject = forced || guessSubject(q, ptext);
      return {
        number: q.number,
        stem: q.stem,
        choices: q.choices,
        subject,
        passageIdx: q.passageIdx,
        tags: [...new Set([...(opts.tags || []), ...autoTags(q, subject)])],
        answer: null,
        explanation: '',
      };
    });

  // Writing prompt fallback: no questions found but essay language present
  const prompts = [];
  if (promptHit && out.length === 0) {
    prompts.push({ title: opts.source || 'Writing prompt', text: clean(text) });
  }

  if (!out.length && !prompts.length) {
    warnings.push('No questions found. If this came from a scanned PDF the text layer may be missing — try pasting the text instead.');
  }
  if (preBuf.length && !passages.length) { /* nothing worth keeping */ }

  return { questions: out, passages, prompts, warnings };
}

/** Apply a key (and optional explanations) onto freshly parsed questions. */
export function applyKey(questions, key, explanations = new Map()) {
  let hit = 0;
  for (const q of questions) {
    const letter = key.get(q.number);
    if (letter && q.choices.some(c => c.letter === letter)) { q.answer = letter; hit++; }
    const ex = explanations.get(q.number);
    if (ex) q.explanation = ex;
  }
  return hit;
}

/** CSV: question,A,B,C,D[,E],answer[,subject][,explanation][,tags] */
export function parseCSV(text) {
  const rows = csvRows(text);
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim().toLowerCase());
  const idx = (n) => head.indexOf(n);
  const hasHeader = idx('question') >= 0 || idx('stem') >= 0;
  const body = hasHeader ? rows.slice(1) : rows;
  const col = {
    stem: hasHeader ? (idx('question') >= 0 ? idx('question') : idx('stem')) : 0,
    answer: hasHeader ? idx('answer') : -1,
    subject: hasHeader ? idx('subject') : -1,
    expl: hasHeader ? (idx('explanation') >= 0 ? idx('explanation') : idx('why')) : -1,
    tags: hasHeader ? idx('tags') : -1,
  };
  const letterCols = LETTERS.split('').map(L => ({ L, i: hasHeader ? head.indexOf(L.toLowerCase()) : -1 }))
                            .filter(c => c.i >= 0);
  return body.filter(r => r.length > 1 && r[col.stem]).map(r => ({
    stem: r[col.stem].trim(),
    choices: (letterCols.length ? letterCols : [{ L: 'A', i: 1 }, { L: 'B', i: 2 }, { L: 'C', i: 3 }, { L: 'D', i: 4 }])
      .map(c => ({ letter: c.L, text: (r[c.i] || '').trim() })).filter(c => c.text),
    answer: col.answer >= 0 ? (r[col.answer] || '').trim().toUpperCase().slice(0, 1) || null : null,
    subject: col.subject >= 0 ? (r[col.subject] || '').trim() : 'English',
    explanation: col.expl >= 0 ? (r[col.expl] || '').trim() : '',
    tags: col.tags >= 0 ? (r[col.tags] || '').split(/[;|]/).map(s => s.trim()).filter(Boolean) : [],
  }));
}

function csvRows(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(f => f.trim()));
}
