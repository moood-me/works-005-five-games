// V. The Return — Salvatore, forty-seven, 1988: the same platform (the frame in his wallet, if he took it); his room as
// it was (the girl crossing the square in his 8 mm, if he filmed her; the mother's question); ⚑ a girl like Elena — go
// after her (Elena at the car on the pier: what Alfredo said that night comes out; ~ «come with me» or «goodbye») or
// stay at the Paradiso; ⚑ the funeral — walk behind the coffin or stand at the door; the tin from Anna; the ruined
// hall and booth: the note on the calendar (if he knows), the strip of kisses against the window (The Strip). No projector
// whirr in this chapter except the memory's flash and «The Strip». game.md §6 "Chapter V".
// Reads: facts.frame, reel8, cinema, elena, knows, hold; marks.mother; choices.station. Leaves: choices.girl, ask (only
// on follow), funeral; hands.note, strip.
import { SCENES, facts } from '../story.js';
import note from '../minigames/note.js';
import strip from '../minigames/strip.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: 'V',
  title: tr('The Return'),
  titles: ['The Platform', 'The Room', 'The Girl', 'The Funeral', 'The Booth'],
  choices: [
    { id: 'girl', weight: '⚑', title: tr('A girl like Elena'), options: [{ id: 'follow', label: tr('Follow her') }, { id: 'let', label: tr('Stay by the Paradiso') }] },
    { id: 'ask', weight: '~', title: tr('Elena thirty years on'), options: [{ id: 'ask', label: tr('“Come with me”') }, { id: 'bye', label: tr('“Goodbye”') }] },
    { id: 'funeral', weight: '⚑', title: tr('The funeral'), options: [{ id: 'walk', label: tr('Walk behind the coffin') }, { id: 'apart', label: tr('Stay by the doors') }] },
  ],
  steps: [
    // the same platform, only smaller; the frame in the wallet
    async g => {
      g.hero('toto');
      g.beds({ wind_cold: 0.4, station: 0.2 });
      const stand = g.told('arrival:stand');
      await g.scene(SCENES.station, { beat: 'arrival' });
      const arrival = g.beat('arrival');
      await stand;
      await g.say('narrator', 'The same platform. Only smaller');
      await arrival;
      if (facts(g.state).frame) {
        const wallet = g.beat('wallet');
        await g.say('narrator', 'I still carried it with me');
        await wallet;
      }
    },
    // his room as it was; the home projector (if he filmed her); the mother's question
    async g => {
      const f = facts(g.state);
      g.hero('toto');
      g.beds({ wind_cold: 0.15 });
      const door = g.told('room:door');
      await g.scene(SCENES.home, { beat: 'room' });
      const room = g.beat('room');
      await door;
      await g.say('maria_old', 'I haven\'t touched a thing. Everything\'s as it was', 'maria');
      await room;
      if (f.reel8) {
        await g.choose(null, { home_projector: [{ id: 'on', label: tr('Turn on the projector') }] });
        const p = held(g, g.sound.camera8());
        const light = g.told('home_movie:light');
        const movie = g.beat('home_movie');
        await light;
        await g.say('narrator', 'Three minutes. She was still crossing the square');
        await movie;
        p.stop(1);
      }
      const asked = g.told('question:asked');
      const question = g.beat('question');
      await asked;
      if (g.state.marks.mother) await g.say('maria_old', 'Once in your life you told me the truth, about the milk. Tell me now too: are you happy?', 'maria');
      else await g.say('maria_old', 'Whenever I called, a different woman always answered. Not one of them sounded as if she loved you. Are you happy?', 'maria');
      if (f.cinema) await g.say('salvatore', 'I\'ve filmed everything I wanted to, Mamma', 'toto');
      else await g.say('salvatore', 'No, Mamma', 'toto');
      await question;
    },
    // the chalk strokes, the boarded Paradiso; a girl like Elena (⚑ girl); Elena at the car (~ ask)
    async g => {
      g.hero('toto');
      g.beds({ wind_cold: 0.4, sea: 0.2 });
      const seen = g.told('girl:seen');
      await g.scene(SCENES.square, { beat: 'girl' });
      const girlBeat = g.beat('girl');
      await seen;
      await g.say('madman_old', 'The square is mine!', 'madman');
      await g.say('narrator', 'I thought I\'d gone mad');
      await girlBeat;
      const girl = await g.choose('girl', {
        daughter: [{ id: 'follow', label: tr('Follow her') }],
        toto: [{ id: 'let', label: tr('Stay by the Paradiso') }],
      });
      if (girl === 'follow') {
        await g.beat('follow');
        g.beds({ sea: 0.6, wind_cold: 0.2 });
        await g.scene(SCENES.quay, { beat: 'car' });
        await g.beat('car');
        await g.choose(null, { elena: [{ id: 'go', label: tr('Go over') }] });
        const future = facts(g.state).elena === 'future';
        const turned = g.told('meet:turned');
        const meet = g.beat('meet');
        await turned;
        await g.say('elena_grown', 'Totò. I knew you\'d come', 'elena');
        await g.say('salvatore', 'Is she your daughter?', 'toto');
        await g.say('elena_grown', 'Yes. She\'s seventeen', 'elena');
        if (future) {
          await g.say('elena_grown', 'I did come, that time. To the booth. I was late', 'elena');
          await g.say('elena_grown', 'Alfredo said: if you love him, leave him. I left you a note. On the calendar', 'elena');
          await g.say('salvatore', 'I never saw it. Never', 'toto');
        } else {
          await g.say('elena_grown', 'You stopped writing first. Remember?', 'elena');
          await g.say('salvatore', 'I remember. Rome. Work', 'toto');
        }
        await meet;
        const ask = await g.choose('ask', {
          elena: [{ id: 'ask', label: tr('“Come with me”') }],
          toto: [{ id: 'bye', label: tr('“Goodbye”') }],
        });
        if (ask === 'ask') {
          await g.say('salvatore', 'Come with me. Tomorrow', 'toto');
          const hand = g.told('ask:hand');
          const asking = g.beat('ask');
          await hand;
          if (future) await g.say('elena_grown', 'We have no future, Totò. Only a past', 'elena');
          else await g.say('elena_grown', 'I have a daughter, Totò. It\'s too late', 'elena');
          await asking;
        } else {
          await g.say('salvatore', 'Goodbye, Elena', 'toto');
          const nod = g.told('bye:nod');
          const bye = g.beat('bye');
          await nod;
          if (future) await g.say('elena_grown', 'Goodbye, Totò. Find the note', 'elena');
          else await g.say('elena_grown', 'We were children. It was a good summer', 'elena');
          await bye;
        }
        const gone = g.told('parting:gone');
        const parting = g.beat('parting');
        await gone;
        g.sound.car();
        await parting;
      } else {
        const hand = g.told('let:hand');
        const let_ = g.beat('let');
        await hand;
        await g.say('narrator', 'I didn\'t go. Let it stay as it was');
        await let_;
      }
    },
    // the funeral past the Paradiso (⚑ funeral); Anna gives him the tin
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ wind_cold: 0.3 });
      const passing = g.told('funeral:passing');
      await g.scene(SCENES.square, { beat: 'funeral' });
      const funeral = g.beat('funeral');
      g.sound.church();
      await passing;
      await g.say('narrator', 'They carried Alfredo past the Paradiso');
      if (g.state.choices.station === 'come') await g.say('narrator', 'He asked me to come. I never did');
      else await g.say('narrator', 'He said: don\'t come back. And I didn\'t');
      await funeral;
      const way = await g.choose('funeral', {
        hearse: [{ id: 'walk', label: tr('Walk behind the coffin') }],
        toto: [{ id: 'apart', label: tr('Stay by the doors') }],
      });
      let tin, widow;
      if (way === 'walk') {
        const hand = g.told('walk_behind:hand');
        const behind = g.beat('walk_behind');
        await hand;
        g.sound.whisper();
        if (f.knows) await g.say('narrator', 'I walked behind him. I knew about the note');
        await behind;
        tin = g.told('widow:tin');
        widow = g.beat('widow'); // (Anna gives the tin by the hearse, before everyone)
      } else {
        const stay = g.beat('stay_door');
        if (f.knows) await g.say('narrator', 'I didn\'t walk behind him. I knew about the note');
        await stay;
        tin = g.told('widow_late:tin');
        widow = g.beat('widow_late'); // (Anna comes back alone once the square is empty)
      }
      await tin;
      await g.say('anna', 'He left you this. He said to put it into your hands', 'anna');
      if (f.hold) await g.say('anna', 'Every summer he asked: has Totò come?', 'anna');
      else await g.say('anna', 'He had me read about you in the papers. Out loud. But he never once wrote to you', 'anna');
      await widow;
    },
    // the ruined hall (the lion's flash of the past), the ruined booth; the note (if he knows); the strip (The Strip)
    async g => {
      const f = facts(g.state);
      g.hero('toto');
      g.beds({ wind_cold: 0.2 });
      await g.scene(SCENES.hall, { beat: 'ruin_hall' });
      await g.beat('ruin_hall');
      await g.choose(null, { lion: [{ id: 'look', label: tr('Look') }] });
      const warm = g.told('memory:warm'), gone = g.told('memory:gone');
      const memory = g.beat('memory');
      await warm;
      g.sound.laugh();
      g.sound.whirr(0.4, 0.5);
      await gone;
      g.sound.whirr(0, 1.5);
      await memory;
      const inside = g.told('ruins:in');
      await g.scene(SCENES.booth, { beat: 'ruins' }, { cut: true });
      const ruins = g.beat('ruins');
      await inside;
      g.sound.pigeons();
      await g.say('narrator', 'I went up to the booth. For the last time');
      await g.say('narrator', 'I understood about the soldier. There\'s no one left to tell');
      await ruins;
      if (f.knows) {
        await g.beat('calendar');
        await g.play(note);
        g.set('pages', 4);
        g.set('dust', 0);
        g.set('fold', 0);
        g.set('calendar', 0);
        await g.letter({
          text: tr('Totò, I came. Alfredo said it would be better for you this way. I\'ll wait.'), sign: tr('Elena'), kind: 'note',
          voice: () => g.say('elena', 'Totò, I came. Alfredo said it would be better for you this way. I\'ll wait', 'narrator'),
        });
        await g.say('narrator', 'For thirty years it hung here. Behind the door');
      }
      await g.beat('window_strip');
      const theme = held(g, g.sound.theme());
      g.signal.addEventListener('abort', () => g.sound.whirr(0, 0.5));
      g.sound.whirr(0.2, 2);
      await g.play(strip, { onProgress: u => theme.loud(0.2 + 0.6 * u, 0.5) });
      g.set('strip_x', 1);
      g.set('strip', 0);
      theme.loud(0.8, 1);
      const heldUp = g.told('strip_end:held');
      const end = g.beat('strip_end');
      await heldUp;
      await g.say('narrator', 'All the kisses Father Adelfio cut. He kept them');
      await end;
      theme.stop(4);
      g.sound.whirr(0, 3);
    },
  ],
};
