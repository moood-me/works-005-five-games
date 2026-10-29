// (beside bespoke/: not the game — moood serves and checks all of bespoke/) node gen/gen.mjs gen/ch bespoke/chapters bespoke/check/lines.mjs
// SAY(n) / SAY(n, 'at') in a chapter's template → g.say('<who>', '<text>'[, 'at']) from game.md §8 (check/lines.mjs)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [src, out, lines] = process.argv.slice(2);
const { LINES } = await import(pathToFileURL(lines).href);
const by = new Map(LINES.map(l => [l[0], l]));
for (const f of readdirSync(src)) {
  const text = readFileSync(join(src, f), 'utf8').replace(/SAY\((\d+)(?:,\s*('[^']*'))?\)/g, (_, n, at) => {
    const l = by.get(Number(n));
    if (!l) throw new Error(`${f}: L${n} is not there`);
    return `g.say('${l[1]}', '${l[2]}'${at ? `, ${at}` : ''})`;
  });
  if (/SAY\(/.test(text)) throw new Error(`${f}: a SAY not replaced`);
  writeFileSync(join(out, f), text);
}
