// Chapter II “Oreanda” — Yalta, summer, both of them. The room: a candle, her shame, the watermelon (always cut) — and
// the choice of how he treated her (eat at the table or bring her a slice); her confession. Oreanda: before dawn above
// the sea. Noon: a kiss looking round, the husband's letter. The station: through Anna's eyes — the carriage window
// (keep looking or draw the curtain: her scale begins, the leash); Gurov alone on the platform. game.md §6, chapter II.
// Reads: facts.eat (the station: what she says), facts.heart (the station: he goes at once or walks after the train).
// Leaves: choices.room, choices.window, shown.anna.
import { SCENES, facts } from '../story.js';
import watermelon from '../minigames/watermelon.js';
import besideHer from '../minigames/beside-her.js';
import sea from '../minigames/sea.js';
import lookingRound from '../minigames/looking-round.js';

export default {
  number: 'II',
  title: tr('Oreanda'),
  season: () => 'summer',
  titles: ['The room', 'Oreanda', 'Noon', 'The station'],
  choices: [
    { id: 'room', weight: '~', title: tr('After the watermelon'), options: [{ id: 'eat', label: tr('Eat at the table') }, { id: 'bring', label: tr('Bring her a slice') }] },
    { id: 'window', weight: '~', title: tr('The carriage window'), options: [{ id: 'look', label: tr('Keep looking') }, { id: 'curtain', label: tr('Draw the curtain') }] },
  ],
  steps: [
    // The room: night, a candle; the watermelon; eat at the table — or bring her a slice and sit beside her; her
    // confession
    async g => {
      g.hero('gurov');
      g.beds({ sea: 0.25, room: 0.3 });
      await g.scene(SCENES.room, { beat: 'room' });
      const room = g.beat('room');
      g.next('room_hold');
      await g.say('narrator', 'Her room was close and smelt of the scent she had bought at the Japanese shop');
      await room;
      const hold = g.beat('room_hold');
      g.next('melon');
      await g.say('anna', 'It’s wrong. You will be the first to despise me now');
      await hold;
      const melon = g.beat('melon');
      g.next('melon_hold');
      await melon;
      const r = await g.play(watermelon);
      g.set('cut', 1);
      g.set('slice', 1);
      g.set('ragged', r.lifts ? 1 : 0);
      g.set('candle', 0.4, 2);
      g.beds({ sea: 0.25, room: 0.3, weep: 0.15 });
      const melonHold = g.beat('melon_hold');
      await g.say('narrator', 'There followed at least half an hour of silence');
      await melonHold;
      const how = await g.choose('room', { watermelon: [{ id: 'eat', label: tr('Eat at the table') }], anna: [{ id: 'bring', label: tr('Bring her a slice') }] });
      if (how === 'eat') {
        g.scale('heart', -2);
        g.next('melon_eat');
        const eat = g.beat('melon_eat');
        g.next('confession_table');
        await eat;
        const speaks = g.told('confession_table:speaks');
        const confession = g.beat('confession_table');
        await speaks;
        await g.say('anna', 'It’s not my husband but myself I have deceived');
        await g.say('anna', 'My husband may be a good, honest man, but he is a flunkey!');
        await g.say('anna', 'I wanted to live! To live, to live…');
        await g.say('gurov', 'Hush, hush…');
        await confession;
      } else {
        g.scale('heart', 2);
        g.next('beside');
        const beside = g.beat('beside');
        g.next('beside_hold');
        await beside;
        const q = await g.play(besideHer);
        g.set('hand_at', 1);
        g.set('pull', 0);
        g.set('palm', 1);
        g.set('apart', q.pulls ? 1 : 0);
        const besideHold = g.beat('beside_hold');
        g.next('confession_bed');
        await g.say('gurov', 'How could I despise you?');
        await besideHold;
        const speaks = g.told('confession_bed:speaks');
        const confession = g.beat('confession_bed');
        await speaks;
        await g.say('anna', 'It’s not my husband but myself I have deceived');
        await g.say('anna', 'My husband may be a good, honest man, but he is a flunkey!');
        await g.say('anna', 'I wanted to live! To live, to live…');
        await g.say('gurov', 'Hush, hush…');
        await confession;
      }
      g.beds({ sea: 0.25, room: 0.3 });
    },
    // Oreanda: before dawn, the seat above the sea; the keeper; dew on the grass
    async g => {
      g.hero('both');
      g.beds({ sea: 0.6, cicadas: 0.4 }, 3);
      const sat = g.told('bench:sat');
      await g.scene(SCENES.oreanda, { beat: 'bench' });
      const bench = g.beat('bench');
      g.next('still');
      await sat;
      await g.say('narrator', 'At Oreanda they sat on a seat not far from the church, looked down at the sea, and were silent');
      await bench;
      const still = g.beat('still');
      g.next('watchman');
      await still;
      let told = false;
      const r = await g.play(sea, { sea: () => (told = true, g.say('narrator', 'So it must have sounded when there was no Yalta, no Oreanda here; so it sounds now, and it will sound as indifferently and monotonously when we are all no more')) });
      g.set('dawn', 1, 1);
      g.set('lights', 0, 2);
      g.set('cicada', 0);
      g.set('hand', r.touched.includes('hand') ? 1 : 0);
      g.beds({ sea: 0.6 });
      if (!told) await g.say('narrator', 'So it must have sounded when there was no Yalta, no Oreanda here; so it sounds now, and it will sound as indifferently and monotonously when we are all no more');
      const looks = g.told('watchman:looks');
      const gone = g.told('watchman:gone');
      const watchman = g.beat('watchman');
      g.next('dew');
      await looks;
      await g.say('narrator', 'A man walked up to them — probably a keeper — looked at them and walked away');
      await gone;
      await g.say('narrator', 'They saw a steamer come from Theodosia, with its lights out in the glow of dawn');
      await watchman;
      const dew = g.beat('dew');
      await g.say('anna', 'There is dew on the grass', 'anna');
      await g.say('gurov', 'Yes. It’s time to go home');
      await dew;
    },
    // Noon: every day at noon together; a kiss looking round; the husband's letter
    async g => {
      g.hero('both');
      g.beds({ sea: 0.4, cicadas: 0.5 });
      await g.scene(SCENES.quay, { beat: 'noon_garden' });
      const garden = g.beat('noon_garden');
      g.next('days');
      await g.say('narrator', 'Every day at twelve o’clock they met on the sea-front, lunched and dined together, went for walks');
      await g.say('narrator', 'They kissed in broad daylight, looking round in dread of someone’s seeing them');
      await garden;
      const r = await g.play(lookingRound);
      g.set('kiss_now', 1);
      g.set('seen', 0);
      g.set('gossip', r.seen ? 1 : 0);
      const letter = g.told('days:letter');
      const days = g.beat('days');
      await letter;
      await g.say('narrator', 'But then a letter came from her husband');
      await Promise.all([g.letter({ text: tr('Anna, something is wrong with my eyes. Come home, if you can. Don’t overfeed the Pomeranian.'), sign: tr('Your husband') }), g.say('diderits', 'Anna, something is wrong with my eyes. Come home, if you can. Don’t overfeed the Pomeranian', 'narrator')]);
      g.sound.paper();
      await days;
    },
    // The station: through Anna's eyes — the parting, the carriage window; then Gurov alone on the platform
    async g => {
      const f = facts(g.state);
      g.hero('anna');
      g.beds({ crickets: 0.5, wires: 0.3, steam: 0.4 });
      const bell = g.told('platform:bell');
      await g.scene(SCENES.station, { beat: 'platform' });
      const platform = g.beat('platform');
      g.next('board');
      bell.then(rang => { if (rang) g.sound.bell(); });
      if (f.eat) await g.say('anna', 'It’s a good thing I am going away. It’s the finger of destiny');
      else await g.say('anna', 'Let me look at you once more… Look at you once again. That’s right');
      await g.say('anna', 'We are parting for ever — it must be so, for we ought never to have met');
      await bell;
      await platform;
      await g.beat('board');
      const way = await g.choose('window', { anna: [{ id: 'look', label: tr('Keep looking') }], 'carriage#curtain': [{ id: 'curtain', label: tr('Draw the curtain') }] });
      g.gauge('anna');
      g.sound.whistle();
      const alone = f.heart === 'frank' ? 'alone_far' : 'alone_turn';
      if (way === 'look') {
        g.scale('anna', 1);
        g.next('look_back');
        const back = g.beat('look_back');
        g.next(alone);
        g.sound.wheels();
        await back;
      } else {
        g.scale('anna', -1);
        g.next('curtain');
        const curtain = g.beat('curtain');
        g.next(alone);
        g.sound.wheels();
        await curtain;
      }
      g.hero('gurov');
      g.beds({ crickets: 0.6, wires: 0.4 });
      const moment = g.told(alone === 'alone_far' ? 'alone_far:stands' : 'alone_turn:door');
      const last = g.beat(alone);
      await g.say('narrator', 'He was left alone on the platform. The grasshoppers chirruped and the telegraph wires hummed');
      await moment;
      await g.say('gurov_inner', 'So that was one more adventure… And it, too, is at an end', 'gurov');
      await last;
      await g.say('narrator', 'There was already a scent of autumn at the station; it was a cool evening');
    },
  ],
};
