// V. Возвращение — Salvatore, forty-seven, 1988: the same platform (the frame in his wallet, if he took it); his room as
// it was (the girl crossing the square in his 8 mm, if he filmed her; the mother's question); ⚑ a girl like Elena — go
// after her (Elena at the car on the pier: what Alfredo said that night comes out; ~ «come with me» or «goodbye») or
// stay at the «Парадизо»; ⚑ the funeral — walk behind the coffin or stand at the door; the tin from Anna; the ruined
// hall and booth: the note on the calendar (if he knows), the strip of kisses against the window (Лента). No projector
// whirr in this chapter except the memory's flash and «Лента». game.md §6 «Глава V».
// Reads: facts.frame, reel8, kino, elena, knows, hold; marks.mother; choices.station. Leaves: choices.girl, ask (only
// on follow), funeral; hands.zapiska, lenta.
import { SCENES, facts } from '../story.js';
import zapiska from '../minigames/zapiska.js';
import lenta from '../minigames/lenta.js';

// a handle of sound (theme, camera8) stopped when the step is left
const held = (g, h) => {
  g.signal.addEventListener('abort', () => h.stop(0.5));
  return h;
};

export default {
  number: 'V',
  title: 'Возвращение',
  titles: ['Перрон', 'Комната', 'Девушка', 'Похороны', 'Будка'],
  choices: [
    { id: 'girl', weight: '⚑', title: 'Девушка, похожая на Елену', options: [{ id: 'follow', label: 'Пойти за ней' }, { id: 'let', label: 'Остаться у «Парадизо»' }] },
    { id: 'ask', weight: '~', title: 'Елена через тридцать лет', options: [{ id: 'ask', label: '«Поедем со мной»' }, { id: 'bye', label: '«Прощай»' }] },
    { id: 'funeral', weight: '⚑', title: 'Похороны', options: [{ id: 'walk', label: 'Идти за гробом' }, { id: 'apart', label: 'Остаться у дверей' }] },
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
      await g.say('narrator', 'Тот же перрон. Только меньше');
      await arrival;
      if (facts(g.state).frame) {
        const wallet = g.beat('wallet');
        await g.say('narrator', 'Я всё ещё носил его с собой');
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
      await g.say('maria_old', 'Я ничего не трогала. Всё как было', 'maria');
      await room;
      if (f.reel8) {
        await g.choose(null, { home_projector: [{ id: 'on', label: 'Включить проектор' }] });
        const p = held(g, g.sound.camera8());
        const light = g.told('home_movie:light');
        const movie = g.beat('home_movie');
        await light;
        await g.say('narrator', 'Три минуты. Она всё ещё шла через площадь');
        await movie;
        p.stop(1);
      }
      const asked = g.told('question:asked');
      const question = g.beat('question');
      await asked;
      if (g.state.marks.mother) await g.say('maria_old', 'Ты мне раз в жизни сказал правду — про молоко. Скажи и теперь: ты счастлив?', 'maria');
      else await g.say('maria_old', 'Когда я звонила, всегда брала трубку другая женщина. Ни одна не говорила так, будто тебя любит. Ты счастлив?', 'maria');
      if (f.kino) await g.say('salvatore', 'Я снял всё, что хотел, мама', 'toto');
      else await g.say('salvatore', 'Нет, мама', 'toto');
      await question;
    },
    // the chalk strokes, the boarded «Парадизо»; a girl like Elena (⚑ girl); Elena at the car (~ ask)
    async g => {
      g.hero('toto');
      g.beds({ wind_cold: 0.4, sea: 0.2 });
      const seen = g.told('girl:seen');
      await g.scene(SCENES.square, { beat: 'girl' });
      const girlBeat = g.beat('girl');
      await seen;
      await g.say('madman_old', 'Площадь моя!', 'madman');
      await g.say('narrator', 'Я подумал, что сошёл с ума');
      await girlBeat;
      const girl = await g.choose('girl', {
        daughter: [{ id: 'follow', label: 'Пойти за ней' }],
        toto: [{ id: 'let', label: 'Остаться у «Парадизо»' }],
      });
      if (girl === 'follow') {
        await g.beat('follow');
        g.beds({ sea: 0.6, wind_cold: 0.2 });
        await g.scene(SCENES.quay, { beat: 'car' });
        await g.beat('car');
        await g.choose(null, { elena: [{ id: 'go', label: 'Подойти' }] });
        const future = facts(g.state).elena === 'future';
        const turned = g.told('meet:turned');
        const meet = g.beat('meet');
        await turned;
        await g.say('elena_grown', 'Тото. Я знала, что ты приедешь', 'elena');
        await g.say('salvatore', 'Это твоя дочь?', 'toto');
        await g.say('elena_grown', 'Моя. Ей семнадцать', 'elena');
        if (future) {
          await g.say('elena_grown', 'Я пришла тогда. В будку. Опоздала', 'elena');
          await g.say('elena_grown', 'Альфредо сказал: если любишь — оставь его. Я оставила тебе записку. На календаре', 'elena');
          await g.say('salvatore', 'Я её не видел. Никогда', 'toto');
        } else {
          await g.say('elena_grown', 'Ты перестал писать первым. Помнишь?', 'elena');
          await g.say('salvatore', 'Помню. Рим. Работа', 'toto');
        }
        await meet;
        const ask = await g.choose('ask', {
          elena: [{ id: 'ask', label: '«Поедем со мной»' }],
          toto: [{ id: 'bye', label: '«Прощай»' }],
        });
        if (ask === 'ask') {
          await g.say('salvatore', 'Поедем со мной. Завтра', 'toto');
          const hand = g.told('ask:hand');
          const asking = g.beat('ask');
          await hand;
          if (future) await g.say('elena_grown', 'Будущего у нас нет, Тото. Есть только прошлое', 'elena');
          else await g.say('elena_grown', 'У меня дочь, Тото. Поздно', 'elena');
          await asking;
        } else {
          await g.say('salvatore', 'Прощай, Елена', 'toto');
          const nod = g.told('bye:nod');
          const bye = g.beat('bye');
          await nod;
          if (future) await g.say('elena_grown', 'Прощай, Тото. Найди записку', 'elena');
          else await g.say('elena_grown', 'Мы были детьми. Это было хорошее лето', 'elena');
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
        await g.say('narrator', 'Я не пошёл. Пусть останется, как было');
        await let_;
      }
    },
    // the funeral past the «Парадизо» (⚑ funeral); Anna gives him the tin
    async g => {
      const f = facts(g.state);
      g.hero('both');
      g.beds({ wind_cold: 0.3 });
      const passing = g.told('funeral:passing');
      await g.scene(SCENES.square, { beat: 'funeral' });
      const funeral = g.beat('funeral');
      g.sound.church();
      await passing;
      await g.say('narrator', 'Альфредо везли мимо «Парадизо»');
      if (g.state.choices.station === 'come') await g.say('narrator', 'Он звал. Я не ехал');
      else await g.say('narrator', 'Он сказал — не возвращайся. Я и не вернулся');
      await funeral;
      const way = await g.choose('funeral', {
        hearse: [{ id: 'walk', label: 'Идти за гробом' }],
        toto: [{ id: 'apart', label: 'Остаться у дверей' }],
      });
      let tin, widow;
      if (way === 'walk') {
        const hand = g.told('walk_behind:hand');
        const behind = g.beat('walk_behind');
        await hand;
        g.sound.whisper();
        if (f.knows) await g.say('narrator', 'Я шёл за ним. Я знал про записку');
        await behind;
        tin = g.told('widow:tin');
        widow = g.beat('widow'); // (Anna gives the tin by the hearse, before everyone)
      } else {
        const stay = g.beat('stay_door');
        if (f.knows) await g.say('narrator', 'Я не пошёл за ним. Я знал про записку');
        await stay;
        tin = g.told('widow_late:tin');
        widow = g.beat('widow_late'); // (Anna comes back alone once the square is empty)
      }
      await tin;
      await g.say('anna', 'Он оставил тебе. Велел отдать в руки', 'anna');
      if (f.hold) await g.say('anna', 'Каждое лето спрашивал: Тото не приехал?', 'anna');
      else await g.say('anna', 'Читать про тебя в газетах велел. Вслух. А написать тебе — ни разу не написал', 'anna');
      await widow;
    },
    // the ruined hall (the lion's flash of the past), the ruined booth; the note (if he knows); the strip (Лента)
    async g => {
      const f = facts(g.state);
      g.hero('toto');
      g.beds({ wind_cold: 0.2 });
      await g.scene(SCENES.hall, { beat: 'ruin_hall' });
      await g.beat('ruin_hall');
      await g.choose(null, { lion: [{ id: 'look', label: 'Посмотреть' }] });
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
      await g.say('narrator', 'Я поднялся в будку. В последний раз');
      await g.say('narrator', 'Я понял про солдата. Сказать уже некому');
      await ruins;
      if (f.knows) {
        await g.beat('calendar');
        await g.play(zapiska);
        g.set('pages', 4);
        g.set('dust', 0);
        g.set('fold', 0);
        g.set('calendar', 0);
        await g.letter({
          text: 'Тото, я приходила. Альфредо сказал, что так будет лучше для тебя. Я буду ждать.', sign: 'Елена', kind: 'note',
          voice: () => g.say('elena', 'Тото, я приходила. Альфредо сказал, что так будет лучше для тебя. Я буду ждать', 'narrator'),
        });
        await g.say('narrator', 'Тридцать лет она висела здесь. За дверью');
      }
      await g.beat('window_strip');
      const theme = held(g, g.sound.theme());
      g.signal.addEventListener('abort', () => g.sound.whirr(0, 0.5));
      g.sound.whirr(0.2, 2);
      await g.play(lenta, { onProgress: u => theme.loud(0.2 + 0.6 * u, 0.5) });
      g.set('strip_x', 1);
      g.set('strip', 0);
      theme.loud(0.8, 1);
      const heldUp = g.told('strip_end:held');
      const end = g.beat('strip_end');
      await heldUp;
      await g.say('narrator', 'Все поцелуи, что вырезал отец Адельфио. Он их сохранил');
      await end;
      theme.stop(4);
      g.sound.whirr(0, 3);
    },
  ],
};
