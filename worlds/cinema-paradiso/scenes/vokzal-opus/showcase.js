
// Outside the game: dawn of 1959 — the farewell, boarding, the train going (Alfredo stays), then the look back from
// the train (he goes off); and the evening of 1988 — Salvatore on the same platform.
const play = name => ({ name, run: async s => { s.set('beat', name); await s.until(() => s.get('beat_last') === name); } });
const stays = v => ({ name: v ? 'Альфредо остаётся' : 'Альфредо уходит', run: async s => { s.set('alfredo_stays', v); } });
return [stays(1), play('platform'), play('boarding'), play('away'), stays(0), play('platform'), play('boarding'), play('back_look'), play('arrival')];
