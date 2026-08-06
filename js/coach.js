// The coach: why you missed it, what habit caused it, and what to do instead.

// ---------------------------------------------------------------- tips
export const TIPS = [
  // English
  { s:'English', t:'punctuation', b:'Commas come in pairs or not at all', x:'If you can lift the phrase out and the sentence still works, it needs a comma on BOTH sides. One lonely comma around a phrase is almost always wrong.' },
  { s:'English', t:'punctuation', b:'No comma between subject and verb', x:'"The tall boy in the red coat, ran." — never. If nothing interrupts, no comma.' },
  { s:'English', t:'semicolon-colon-dash', b:'Semicolon = period', x:'A semicolon must have a complete sentence on both sides. If a period works there, so does the semicolon — and if it does not, the semicolon is wrong.' },
  { s:'English', t:'semicolon-colon-dash', b:'Colon needs a full sentence in front', x:'What comes after a colon can be a list, a phrase, anything. What comes BEFORE must stand alone.' },
  { s:'English', t:'semicolon-colon-dash', b:'Dashes work like commas', x:'Two dashes bracket an interruption. You can pair dash-dash or comma-comma, never dash-comma.' },
  { s:'English', t:'conciseness', b:'Shortest grammatical answer usually wins', x:'When two choices both work, ACT picks the shorter one. Redundancy is the trap: "annual event held each year".' },
  { s:'English', t:'rhetorical-skills', b:'Answer the question that is actually asked', x:'"Which choice best emphasizes the speed…" — grammar does not decide this one. Reread what the question wants and pick the choice that does THAT job.' },
  { s:'English', t:'author-purpose', b:'For add/delete questions, decide first, then match', x:'Decide yes or no on your own, then eliminate the two options with the wrong yes/no. Half the choices die instantly.' },
  { s:'English', t:'pronouns-apostrophes', b:'Its/it\'s, their/they\'re, whose/who\'s', x:'Apostrophe = contraction, every time. "It\'s" only ever means "it is". Expand it out loud and the wrong ones die.' },
  { s:'English', t:'agreement-tense', b:'Cross out the middle', x:'"The box of old letters (was/were) heavy." Delete the prepositional phrase and the subject-verb match becomes obvious.' },
  { s:'English', t:'organization', b:'Placement questions hinge on one word', x:'Find the transition or pronoun that only makes sense after a specific sentence. That word tells you where the sentence goes.' },
  { s:'English', t:'', b:'NO CHANGE is right about a quarter of the time', x:'It is not a trap answer and it is not a safe answer. Test it like any other choice: read the sentence with it, then with the others.' },

  // Math
  { s:'Math', t:'algebra', b:'Plug in the answers', x:'Multiple-choice means the answer is on the page. Start with the middle value — if it is too big or small you kill three choices at once.' },
  { s:'Math', t:'word-problem', b:'Pick your own numbers', x:'When the problem is all variables, set x = 2 (or 100 for percents), run it through, then test the choices.' },
  { s:'Math', t:'geometry', b:'Draw it and label it', x:'Every geometry question you miss in your head, you would get on paper. Redraw the figure, write in every value you know.' },
  { s:'Math', t:'geometry', b:'Figures are drawn to scale unless told otherwise', x:'You can estimate lengths and angles off the picture to eliminate wild choices.' },
  { s:'Math', t:'stats-probability', b:'Average = total ÷ count, always', x:'Most "average" traps want the TOTAL. Find the sum first, then work backwards.' },
  { s:'Math', t:'coordinate-geometry', b:'Slope is rise over run — and sign matters', x:'Half of coordinate misses are a dropped negative. Write the formula, substitute with parentheses.' },
  { s:'Math', t:'trigonometry', b:'SOHCAHTOA and the unit circle cover ~90%', x:'ACT trig rarely goes past right triangles, sin/cos graphs, and the law of sines/cosines given in the problem.' },
  { s:'Math', t:'', b:'The last 10 questions are worth the same as the first 10', x:'If a question is going to take three minutes, mark it and move. Score comes from finishing the easy ones.' },
  { s:'Math', t:'', b:'Answer the question asked', x:'You solved for x. The question wanted 2x. That choice is on the page on purpose.' },

  // Reading
  { s:'Reading', t:'detail', b:'Go back to the text — every time', x:'If you cannot point to the line that proves your answer, it is a guess. The proof is always there.' },
  { s:'Reading', t:'inference', b:'ACT inferences are small', x:'The right inference is one short step from the text. If your reasoning needs three steps, it is the trap.' },
  { s:'Reading', t:'vocab-in-context', b:'Cover the word and predict it', x:'Read the sentence with a blank, say your own word, then find the choice closest to it. The common meaning is usually the trap.' },
  { s:'Reading', t:'big-picture', b:'Answer big-picture questions last', x:'You will know the passage better after the detail questions. Save the "as a whole" ones.' },
  { s:'Reading', t:'', b:'Extreme words are usually wrong', x:'"always", "never", "proves", "impossible" — ACT answers hedge. Wrong answers overreach.' },
  { s:'Reading', t:'', b:'Half-right is all wrong', x:'The classic trap gets the first half of the sentence right and slips in one wrong word. Read the whole choice.' },
  { s:'Reading', t:'paired-passages', b:'Do Passage A questions before reading B', x:'Do not hold both passages in your head at once. A, its questions, then B, then the comparison ones.' },

  // Science
  { s:'Science', t:'data-representation', b:'Read the axes and units before the question', x:'Ten seconds on the axis labels prevents the most common Science miss: right trend, wrong graph.' },
  { s:'Science', t:'trends', b:'Trace with your finger', x:'"As X increases, Y…" — put a finger on the curve and follow it. Do not reason it out abstractly.' },
  { s:'Science', t:'research-summaries', b:'Skip the paragraphs, go to the figures', x:'Most questions are answered by the tables and graphs. Read the experiment text only when the question forces you to.' },
  { s:'Science', t:'conflicting-viewpoints', b:'Conflicting Viewpoints is a Reading passage in disguise', x:'Note each scientist\'s one-line claim and what they disagree about. Do this passage last; it takes the most time.' },
  { s:'Science', t:'outside-knowledge', b:'Only a handful need real science', x:'Density, photosynthesis, pH, phases of matter, the periodic table basics. Everything else is in the figures.' },

  // Universal
  { s:'', t:'', b:'Never leave a blank', x:'No penalty for wrong answers. If time is short, fill every remaining bubble with the same letter.' },
  { s:'', t:'', b:'Eliminate, do not select', x:'Crossing out three wrong answers is more reliable than falling in love with one right one.' },
  { s:'', t:'', b:'Redo every miss the next day', x:'Reviewing a wrong answer once teaches you nothing. Re-attempting it cold a day later is where the score comes from.' },
];

export function tipsFor(subject, tags = []) {
  const t = new Set(tags);
  const scored = TIPS.map(tip => {
    let score = 0;
    if (tip.s === subject) score += 2; else if (tip.s === '') score += 1;
    if (tip.t && t.has(tip.t)) score += 4;
    return { tip, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.map(x => x.tip);
}

// ------------------------------------------------- offline explanation
/** No key + no API? Still say something useful about the miss. */
export function fallbackExplain(q, chosen) {
  const bits = [];
  const correct = q.choices.find(c => c.letter === q.answer);
  const picked = q.choices.find(c => c.letter === chosen);
  if (correct && picked) {
    const cl = correct.text.trim().length, pl = picked.text.trim().length;
    if (q.subject === 'English' && pl > cl * 1.4)
      bits.push('Your choice was the wordier one. On English, when two options are both grammatical, the shorter one is the answer.');
    if (q.subject === 'English' && /^no change$/i.test(picked.text))
      bits.push('You went with NO CHANGE. Read the sentence out loud with each other option before defaulting to it.');
    if (q.subject === 'English' && /^no change$/i.test(correct.text))
      bits.push('The original was already right — you changed something that did not need changing.');
    const pn = picked.text.match(/-?\d+(\.\d+)?/g), cn = correct.text.match(/-?\d+(\.\d+)?/g);
    if (q.subject === 'Math' && pn && cn && pn[0] && cn[0] && Math.abs(parseFloat(pn[0])) === Math.abs(parseFloat(cn[0])))
      bits.push('Same number, different sign — that is a dropped negative, not a concept gap.');
  }
  const tips = tipsFor(q.subject, q.tags).slice(0, 2);
  for (const t of tips) bits.push(`${t.b} — ${t.x}`);
  return bits.join('\n\n') || 'No stored explanation for this one. Add one from the Library tab so it is here next time.';
}

// ------------------------------------------------------ AI explanation
const KEY_STORE = 'elle-act-api-key';
export const getKey = () => localStorage.getItem(KEY_STORE) || '';
export const setKey = (k) => localStorage.setItem(KEY_STORE, k.trim());
export const clearKey = () => localStorage.removeItem(KEY_STORE);

export async function aiExplain(q, chosen, passageText = '') {
  const key = getKey();
  if (!key) throw new Error('no-key');
  const choices = q.choices.map(c => `${c.letter}. ${c.text}`).join('\n');
  const known = q.answer ? `The correct answer is ${q.answer}.` : 'No answer key is available — work out the correct answer yourself.';
  const pick = chosen ? `The student chose ${chosen}.` : 'The student did not answer.';
  const ctx = passageText ? `\n\nPassage context:\n"""${passageText.slice(0, 4000)}"""` : '';

  const body = {
    model: 'claude-sonnet-5',
    max_tokens: 700,
    system: 'You are an ACT tutor. Be concrete and brief. Never pad. Use plain language a high school student reads fast.',
    messages: [{
      role: 'user',
      content: `ACT ${q.subject} question.${ctx}

Question ${q.number || ''}: ${q.stem}
${choices}

${known}
${pick}

Reply in exactly this shape, no preamble:

**Why ${q.answer || 'the right answer'} is right:** 1-3 sentences.
**Why your answer is wrong:** name the specific trap in the choice they picked (skip if they picked correctly, and instead say what makes this type easy to miss).
**Rule to remember:** one sentence they can use on the next question of this type.`,
    }],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`api-${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
}

// --------------------------------------------------------- diagnosis
/**
 * Reads your attempt history and names the habits costing you points.
 * attempts: {questionId, correct, chosen, ms, at, subject, tags, skipped, choiceMeta}
 */
export function diagnose(attempts, questions) {
  const qById = new Map(questions.map(q => [q.id, q]));
  const graded = attempts.filter(a => !a.skipped && a.chosen);
  const dx = [];
  if (graded.length < 8) {
    return [{ title: 'Not enough data yet', body: `Answer about ${Math.max(0, 15 - graded.length)} more questions and this page fills in with the specific habits costing you points.`, sev: 'low' }];
  }

  const acc = (rows) => rows.length ? rows.filter(r => r.correct).length / rows.length : 0;
  const pct = (x) => Math.round(x * 100);

  // 1. weakest tags
  const byTag = new Map();
  for (const a of graded) {
    const q = qById.get(a.questionId);
    for (const t of (q?.tags || [])) {
      if (!byTag.has(t)) byTag.set(t, []);
      byTag.get(t).push(a);
    }
  }
  const weak = [...byTag.entries()].filter(([, rows]) => rows.length >= 4)
    .map(([t, rows]) => ({ t, n: rows.length, a: acc(rows) }))
    .sort((x, y) => x.a - y.a).slice(0, 3).filter(x => x.a < 0.75);
  for (const w of weak) {
    const tip = TIPS.find(tp => tp.t === w.t);
    dx.push({
      title: `${w.t.replace(/-/g, ' ')} — ${pct(w.a)}% (${w.n} seen)`,
      body: tip ? `${tip.b}. ${tip.x}` : `This is your weakest category. Drill it alone: Study → tag "${w.t}".`,
      sev: w.a < 0.5 ? 'high' : 'mid',
      tag: w.t,
    });
  }

  // 2. NO CHANGE habit
  const eng = graded.filter(a => qById.get(a.questionId)?.subject === 'English');
  const ncPicked = eng.filter(a => /^no change$/i.test(a.chosenText || ''));
  const ncCorrect = eng.filter(a => /^no change$/i.test(a.correctText || ''));
  if (eng.length >= 10 && ncPicked.length / eng.length > 0.38) {
    dx.push({ title: 'You lean on NO CHANGE', body: `You picked NO CHANGE on ${pct(ncPicked.length / eng.length)}% of English questions; it is right about 25% of the time. When you are unsure, you are defaulting instead of testing the other three.`, sev: 'mid' });
  }
  if (ncCorrect.length >= 4 && acc(ncCorrect) < 0.6) {
    dx.push({ title: 'You over-correct sentences that were already fine', body: `When NO CHANGE was the answer you got it right only ${pct(acc(ncCorrect))}% of the time. "It sounds weird" is not an error. Name the rule being broken, or leave it alone.`, sev: 'mid' });
  }

  // 3. length bias — needs a real gap, not "9 characters vs 5"
  const lengthy = graded.filter(a => !a.correct && a.chosenLen && a.correctLen &&
                                     a.chosenLen > a.correctLen * 1.3 && a.chosenLen - a.correctLen >= 15);
  const wrongs = graded.filter(a => !a.correct);
  if (wrongs.length >= 6 && lengthy.length / wrongs.length > 0.4) {
    dx.push({ title: 'You pick the longest answer when you are unsure', body: `${pct(lengthy.length / wrongs.length)}% of your misses were the wordiest option on the page. The ACT rewards the shortest choice that is still grammatical and clear.`, sev: 'mid' });
  }

  // 4. pace
  const timed = graded.filter(a => a.ms > 1500 && a.ms < 300000);
  if (timed.length >= 10) {
    const hitMs = timed.filter(a => a.correct).map(a => a.ms);
    const missMs = timed.filter(a => !a.correct).map(a => a.ms);
    const avg = (xs) => xs.reduce((s, x) => s + x, 0) / (xs.length || 1);
    if (missMs.length >= 4 && hitMs.length >= 4) {
      const r = avg(missMs) / avg(hitMs);
      if (r < 0.7) dx.push({ title: 'Your misses are your fastest answers', body: `You spend ${Math.round(avg(missMs) / 1000)}s on questions you miss versus ${Math.round(avg(hitMs) / 1000)}s on ones you get. You are answering before you finish reading. Slow down on the first read; you make the time back by not re-reading.`, sev: 'high' });
      else if (r > 1.9) dx.push({ title: 'You grind on the ones you end up missing', body: `Misses average ${Math.round(avg(missMs) / 1000)}s versus ${Math.round(avg(hitMs) / 1000)}s on hits. If you do not have a path within ~30 seconds, guess, flag it, and move — those minutes are worth more on questions you can actually get.`, sev: 'mid' });
    }
  }

  // 5. letter bias — only over WRONG answers. Counting every answer would just
  // measure how the answer key happened to fall.
  const letterCount = {};
  for (const a of wrongs) letterCount[a.chosen] = (letterCount[a.chosen] || 0) + 1;
  const top = Object.entries(letterCount).sort((a, b) => b[1] - a[1])[0];
  if (top && wrongs.length >= 15 && top[1] / wrongs.length > 0.5) {
    dx.push({ title: `Your wrong answers pile up on ${top[0]}`, body: `${pct(top[1] / wrongs.length)}% of your misses are ${top[0]}. When you are unsure you are defaulting to one letter instead of eliminating. Cross out what you can rule out, then choose from what is left.`, sev: 'low' });
  }

  // 6. tilt — accuracy right after a miss
  let afterMiss = [], afterHit = [];
  const chron = [...graded].sort((a, b) => a.at - b.at);
  for (let i = 1; i < chron.length; i++) {
    if (chron[i].at - chron[i - 1].at > 10 * 60 * 1000) continue;
    (chron[i - 1].correct ? afterHit : afterMiss).push(chron[i]);
  }
  if (afterMiss.length >= 8 && acc(afterMiss) + 0.15 < acc(afterHit)) {
    dx.push({ title: 'One miss drags the next one down', body: `After a wrong answer you drop to ${pct(acc(afterMiss))}% versus ${pct(acc(afterHit))}% after a right one. Missing a question is normal — reset before you read the next stem.`, sev: 'mid' });
  }

  // 7. re-miss (nothing sticking)
  const bySeen = new Map();
  for (const a of chron) {
    if (!bySeen.has(a.questionId)) bySeen.set(a.questionId, []);
    bySeen.get(a.questionId).push(a);
  }
  const repeats = [...bySeen.values()].filter(r => r.length >= 2);
  const reMissed = repeats.filter(r => !r[0].correct && !r.at(-1).correct);
  if (repeats.length >= 6 && reMissed.length / repeats.length > 0.4) {
    dx.push({ title: 'You are missing the same questions twice', body: `${reMissed.length} of ${repeats.length} repeated questions were wrong both times. Reading the answer is not review — after each miss, say the rule out loud and write it down.`, sev: 'high' });
  }

  // 8. skipping
  const skipRate = attempts.filter(a => a.skipped).length / attempts.length;
  if (attempts.length >= 15 && skipRate > 0.15) {
    dx.push({ title: 'You skip a lot', body: `${pct(skipRate)}% of questions get skipped. On the real test there is no skip — take the 20-second guess after eliminating what you can. Guessing well is a skill worth practicing.`, sev: 'low' });
  }

  // 9. fatigue within a session
  const early = graded.filter(a => (a.idx ?? 0) < 5), late = graded.filter(a => (a.idx ?? 0) >= 10);
  if (early.length >= 8 && late.length >= 8 && acc(late) + 0.12 < acc(early)) {
    dx.push({ title: 'Accuracy falls off late in a session', body: `First five: ${pct(acc(early))}%. Question 11 onward: ${pct(acc(late))}%. Shorter, more frequent sets will hold quality better than long ones.`, sev: 'mid' });
  }

  if (!dx.length) dx.push({ title: 'No bad habits showing up', body: 'Nothing in your history stands out as a pattern. Keep adding attempts and check back — or drill your weakest subject on the Stats tab.', sev: 'low' });
  return dx;
}
