// I. Колокольчик — Toto, eight: the priest's bell and the cut kisses (he peeks from behind the curtain), the scissors in
// Alfredo's hands (the boy and the clippings: ~ a frame taken or not — the scale Кино ↔ Люди appears), ⚑ the milk
// money (Alfredo's lie, or the truth), the deal (the boy teaches Alfredo to write his name), the paper from Russia.
// game.md §6 «Глава I». Wall: false — it runs on from the prologue without «Плёнка».
// Reads: hands.podglyadyvat (facts.seen: Р07 / Р128). Leaves: choices.frame, choices.milk; scales.toto (I.2 ±1, I.3
// ±1); marks.frame (take), marks.alfredo (lie), marks.mother (truth); hands.podglyadyvat, skleyka, bukvy.
import { SCENES, facts } from '../story.js';
import podglyadyvat from '../minigames/podglyadyvat.js';
import skleyka from '../minigames/skleyka.js';
import bukvy from '../minigames/bukvy.js';

export default {
  number: 'I',
  title: 'Колокольчик',
  wall: false,
  titles: ['Колокольчик', 'Ножницы', 'Молоко', 'Уговор', 'Бумага'],
  choices: [
    { id: 'frame', weight: '~', title: 'Обрезки', options: [{ id: 'leave', label: 'Пусть хранит' }, { id: 'take', label: 'Взять один кадр' }] },
    { id: 'milk', weight: '⚑', title: 'Деньги на молоко', options: [{ id: 'lie', label: 'Промолчать' }, { id: 'truth', label: 'Сказать правду' }] },
  ],
  steps: [
    // the empty hall, the priest alone in the fifth row; the boy peeks from behind the curtain
    async g => {
      g.hero('toto');
      g.beds({ hall: 0.5, whirr: 0.3 });
      const sat = g.told('priest:sat');
      await g.scene(SCENES.hall, { beat: 'priest' }, { cut: true });
      const priest = g.beat('priest');
      await sat;
      await g.say('narrator', 'Отец Адельфио смотрел каждый фильм первым. Один');
      await priest;
      await g.beat('peek');
      // (each line once, not waited for: the film goes on)
      let rang = false, caught = false;
      await g.play(podglyadyvat, {
        onFirstBell: () => { if (!rang) { rang = true; g.say('adelfio', 'Это — вырезать'); } },
        onCaught: () => { if (!caught) { caught = true; g.say('adelfio', 'Тото! А ну домой!'); } },
      });
      g.set('peek', 0);
      g.set('turn', 0);
      g.set('bell', 0);
      g.set('screen_film', 'romance');
      await g.beat('bell_end');
    },
    // the booth: Alfredo cuts the kisses (Склейка); the boy and the clippings (~ frame)
    async g => {
      g.hero('both');
      g.beds({ whirr: 0.5, hall: 0.2 });
      const door = g.told('cutting:door'), bench = g.told('cutting:bench');
      await g.scene(SCENES.booth, { beat: 'cutting' });
      const cutting = g.beat('cutting');
      await door;
      await g.say('alfredo', 'Кыш! Тебе сюда нельзя');
      await bench;
      if (facts(g.state).seen >= 2) await g.say('toto_boy', 'Он звонил три раза. Я считал', 'toto');
      else await g.say('toto_boy', 'Он звонил. А я прятался', 'toto');
      await cutting;
      await g.beat('splice_in');
      let told = false;
      const r = await g.play(skleyka, {
        onCrooked: () => { if (!told) { told = true; g.say('alfredo', 'Ровно по кадру режь. Чтоб не прыгало', 'narrator'); } },
      });
      for (const n of [1, 2, 3]) {
        g.set(`cut${n}`, 1);
        g.set(`glue${n}`, 1);
        if (!r.jumps) g.set(`bent${n}`, 0); // (skipped or clean: no slanted cut; else as the game left them)
      }
      g.set('boy_reach', 1);
      const tin = g.told('frames:tin');
      const frames = g.beat('frames');
      await tin;
      await g.say('toto_boy', 'А эти куда? Можно мне?', 'toto');
      await g.say('alfredo', 'Они твои. Но храню их я');
      await frames;
      const frame = await g.choose('frame', {
        tin: [{ id: 'leave', label: 'Пусть хранит' }],
        toto: [{ id: 'take', label: 'Взять один кадр' }],
      });
      g.gauge('toto');
      if (frame === 'leave') {
        g.scale('toto', -1);
        await g.beat('tin_shut');
      } else {
        g.scale('toto', 1);
        g.mark('frame', true, 'Кадр останется у Тото.');
        const hidden = g.told('pocket:hidden');
        const pocket = g.beat('pocket');
        await hidden;
        await g.say('narrator', 'Один я унёс. Он не заметил. Или сделал вид');
        await pocket;
      }
    },
    // after the show: the mother and the milk money; Alfredo's coins out of his own pocket (⚑ milk)
    async g => {
      g.hero('toto');
      g.beds({ square: 0.5, cicadas: 0.3, crowd: 0.3 });
      const caught = g.told('after_show:caught');
      await g.scene(SCENES.square, { beat: 'after_show' });
      const after = g.beat('after_show');
      await caught;
      await g.say('maria', 'Где деньги на молоко? Где?', 'maria');
      await after;
      const coins = g.told('alfredo_down:coins');
      const down = g.beat('alfredo_down');
      await coins;
      g.sound.coins();
      await g.say('alfredo', 'Синьора, он их в зале обронил. Я подобрал');
      await down;
      const milk = await g.choose('milk', {
        'alfredo#hand_r': [{ id: 'lie', label: 'Промолчать' }],
        toto: [{ id: 'truth', label: 'Сказать правду' }],
      });
      if (milk === 'lie') {
        g.scale('toto', 1);
        g.mark('alfredo', true, 'Альфредо это запомнит.');
        const take = g.told('coins_taken:take');
        const taken = g.beat('coins_taken');
        await take;
        await g.say('maria', 'Спасибо, дон Альфредо', 'maria');
        await taken;
        g.beds({});
        await g.scene(SCENES.home, { beat: 'supper' });
        await g.beat('supper');
        await g.say('narrator', 'Молоко в тот вечер было');
      } else {
        g.scale('toto', -1);
        g.mark('mother', true, 'Мама это запомнит.');
        await g.say('toto_boy', 'Я их потратил. На кино', 'toto');
        const cut = g.told('slap:cut');
        const slap = g.beat('slap');
        await cut;
        g.sound.slap();
        await slap;
        g.beds({});
        const hand = g.told('photo:hand');
        await g.scene(SCENES.home, { beat: 'photo' });
        const photo = g.beat('photo');
        await hand;
        await g.say('maria', 'Отец в России. Может, живой ещё. А ты — в кино', 'maria');
        await photo;
      }
    },
    // the deal: Alfredo's exam; the boy's hand on his, the chalk (Буквы); the slate up to the lamp
    async g => {
      g.hero('both');
      g.beds({ whirr: 0.3 });
      const primer = g.told('deal:primer');
      await g.scene(SCENES.booth, { beat: 'deal' });
      const deal = g.beat('deal');
      await primer;
      await g.say('alfredo', 'Экзамен мне сдавать. За начальную школу. Без бумаги механиком не оставят');
      await g.say('toto_boy', 'Научу. А ты меня — кино крутить', 'toto');
      await g.say('alfredo', 'Договорились. Только матери ни слова');
      await deal;
      await g.beat('slate_in');
      const r = await g.play(bukvy);
      g.set('letters', 8);
      g.set('chalk_x', 1);
      g.set('wobble', 0);
      g.set('crooked', r.crooked ?? '00000000');
      const up = g.told('slate_out:up');
      const out = g.beat('slate_out');
      await up;
      await g.say('alfredo', 'А-ль-фре-до. Гляди-ка. Это я');
      await out;
    },
    // the paper from Russia: the mother in black crosses the square, the poster, the boy takes her hand
    async g => {
      g.hero('toto');
      g.beds({ square: 0.3, cicadas: 0.2 });
      const hand = g.told('paper:hand');
      await g.scene(SCENES.square, { beat: 'paper', poster: 1 });
      const paper = g.beat('paper');
      await hand;
      await g.say('narrator', 'Отец не вернулся из России. Нам прислали бумагу');
      await paper;
    },
  ],
};
