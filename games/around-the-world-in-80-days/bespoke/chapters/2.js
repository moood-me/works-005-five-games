// II. Hong Kong «in which Passepartout loses his master» — game.md §3. The night on the «Rangoon» (~ answer; Aouda writes her
// line in the notebook); Hong Kong: the cousin gone — ⚑ aouda: Europe or Holland; the tavern, Fix, the pipe («Stay
// awake»), the «Carnatic» sails with Passepartout alone; the morning, the «Tankadere» (~ boat: Fix taken or not);
// the typhoon («The typhoon»), the gun at Shanghai; Yokohama — the Long Noses («The pyramid»: drop or hold, by the hands); the
// «General Grant» (~ punch), two Wednesdays.
// Reads: choices.sati; hands stay-awake, typhoon, pyramid; marks fix. Leaves: choices answer, aouda, boat, punch;
// choices.pyramid (by the hands: by — the minigame that makes it); hours, money; marks aouda, fix, pp, bruise, wings; lines.
import { SCENES } from '../story.js';
import stayAwake from '../minigames/stay-awake.js';
import typhoon from '../minigames/typhoon.js';
import pyramid from '../minigames/pyramid.js';

export default {
  number: 'II',
  title: tr('Hong Kong'),
  heading: tr('in which Passepartout loses his master'),
  route: [0.22, 0.55],
  titles: [tr('The Rangoon\'s deck'), tr('The cousin'), tr('The tavern'), tr('The Tankadere'), tr('The typhoon'), tr('The Long Noses'), tr('Two Wednesdays')],
  choices: [
    { id: 'answer', weight: '~', title: tr('Fogg\'s answer'), options: [{ id: 'spare', label: tr('I had them to spare') }, { id: 'plaid', label: tr('Give her the plaid') }, { id: 'notlost', label: tr('I have not lost them') }] },
    { id: 'aouda', weight: '⚑', title: tr('Aouda'), options: [{ id: 'europe', label: tr('Come with us to Europe') }, { id: 'holland', label: tr('A passage to Holland') }] },
    { id: 'boat', weight: '~', title: tr('Fix on the boat'), options: [{ id: 'take', label: tr('Come with us') }, { id: 'leave', label: tr('Cast off') }] },
    { id: 'pyramid', weight: '~', by: 'pyramid', title: tr('The pyramid'), options: [{ id: 'drop', label: tr('Let go') }, { id: 'hold', label: tr('Hold to the end') }] },
    { id: 'punch', weight: '~', title: tr('Fix on the General Grant'), options: [{ id: 'punch', label: tr('Strike him') }, { id: 'shake', label: tr('Shake hands') }] },
  ],
  steps: [
    // the «Rangoon» at night: Aouda at the rail; ~ the answer; she writes a line in the notebook
    async g => {
      g.hero('fogg');
      const turns = g.told('rail_night:turns');
      await g.scene(SCENES.deck, { beat: 'rail_night', ship: 'rangoon', port: 'none', with_aouda: 1 }, { beds: { sea: 0.5, clock: 0.15 } });
      const night = g.beat('rail_night');
      await turns;
      await (g.state.choices.sati === 'road' ? g.say('aouda', 'You took a risk for my sake') : g.say('aouda', 'You lost twelve hours because of me'));
      await night;
      const answer = await g.choose('answer', {
        'fogg#head': [{ id: 'spare', label: tr('I had them to spare') }, { id: 'plaid', label: tr('Give her the plaid') }, { id: 'notlost', label: tr('I have not lost them') }],
      });
      g.set('beat_next', answer === 'plaid' ? 'plaid' : 'writes');
      if (answer === 'spare') await g.say('fogg', 'I had them to spare');
      else if (answer === 'notlost') {
        await g.say('fogg', 'I have not lost them');
        g.relate('aouda', 1);
      } else {
        await g.beat('plaid');
        g.relate('aouda', 1);
      }
      await g.say('aouda', 'May I have your notebook, Mr. Fogg?');
      await g.book('cousin', 'aouda');
      await g.beat('writes');
    },
    // Hong Kong: the cousin gone two years — ⚑ Europe or Holland
    async g => {
      g.hero('fogg');
      const met = g.told('quay:met');
      await g.scene(SCENES.harbour, { beat: 'quay', port: 'hongkong', with_aouda: 1, aouda_dress: 1, evening: 0, night: 0 }, { beds: { town: 0.4, sea: 0.3 } });
      const quay = g.beat('quay');
      await met;
      await g.say('fogg', 'Your cousin left for Holland two years ago');
      await quay;
      const back = g.told('cousin:looks-back');
      const cousin = g.beat('cousin');
      await back;
      await g.say('aouda', 'What am I to do, Mr. Fogg?');
      await cousin;
      const aouda = await g.choose('aouda', {
        'fogg#head': [{ id: 'europe', label: tr('Come with us to Europe') }],
        'aouda#head': [{ id: 'holland', label: tr('A passage to Holland') }],
      });
      if (aouda === 'europe') {
        await g.say('fogg', 'Come with us to Europe');
        await g.say('aouda', 'With you… Yes');
      } else {
        await g.say('fogg', 'I will pay your passage to Holland. The mail steamer is safe, and it will take you to your kin');
        g.money(-500);
        g.mark('holland', true, tr('Aouda will remember this'));
        await g.say('aouda', 'Thank you, Mr. Fogg');
      }
    },
    // the tavern: Fix reveals himself; the pipe; «Stay awake»; the «Carnatic» sails with Passepartout
    async g => {
      g.hero('pp');
      const poured = g.told('tavern:poured');
      await g.scene(SCENES.harbour, { beat: 'tavern', port: 'hongkong' }, { beds: { town: 0.5, sea: 0.2 } });
      const tavern = g.beat('tavern');
      await poured;
      await g.say('passepartout', 'The Carnatic sails tonight, not tomorrow! I must tell my master!');
      await tavern;
      const shown = g.told('badge:shown'), up = g.told('badge:up');
      const badge = g.beat('badge');
      await shown;
      await g.say('fix', 'I am a detective. Your master is the Bank of England robber. Keep him here — and five hundred pounds are yours');
      await up;
      await g.say('passepartout', 'My master is the most honest of men!');
      await badge;
      await g.say('fix', 'Drink with me. One pipe — for friendship\'s sake');
      await g.beat('pipe');
      g.beds({ town: 0.25, sea: 0.4 });
      const r = await g.play(stayAwake);
      g.mark('told', !!r?.told);
      const aboard = g.told('carnatic:aboard');
      await g.scene(SCENES.harbour, { beat: 'carnatic', port: 'hongkong' }, { beds: { sea: 0.5 } });
      const carnatic = g.beat('carnatic');
      await aboard;
      await g.say('passepartout', 'Master… the Carnatic…');
      g.sound.trainWhistle();
      await carnatic;
    },
    // the morning: the pier empty; Bunsby and the «Tankadera»; ~ Fix taken on board or not
    async g => {
      g.hero('fogg');
      const told = g.state.marks.told;
      const watch = g.told('morning:watch');
      await g.scene(SCENES.harbour, { beat: 'morning', port: 'hongkong', evening: 0, night: 0 }, { beds: { sea: 0.4, town: 0.2 } });
      const morning = g.beat('morning');
      await watch;
      await (told ? g.say('fogg', 'The boatman was right. The Carnatic sailed in the night') : g.say('fogg', 'The Carnatic has gone. And Passepartout with her'));
      await morning;
      g.hours(told ? -4 : -10, told ? tr('The news came in the night') : tr('The news came in the morning'));
      const fix = g.told('bunsby:fix');
      const bunsby = g.beat('bunsby');
      await g.say('bunsby', 'Eight hundred miles in this weather, sir?');
      await g.say('fogg', 'A hundred pounds a day. And two hundred if we arrive in time');
      g.money(-800);
      g.sound.notes();
      await fix;
      await g.say('fix', 'I too have missed the Carnatic');
      await bunsby;
      const boat = await g.choose('boat', {
        'fix#head': [{ id: 'take', label: tr('Come with us') }],
        'bunsby#head': [{ id: 'leave', label: tr('Cast off') }],
      });
      if (boat === 'take') {
        await g.say('fogg', 'Come with us');
        g.money(-100);
        g.relate('fix', 1);
        g.relate('pp', -1);
      }
      const sails = g.told('cast_off:sails-up');
      g.set('with_fix', boat === 'take' ? 1 : 0);
      const off = g.beat('cast_off');
      await sails;
      await off;
      if (g.state.choices.aouda === 'holland') {
        const wave = g.told('stay_behind:wave');
        const stay = g.beat('stay_behind');
        await wave;
        await g.wait(1500);
        await stay;
      }
    },
    // the typhoon; the gun at Shanghai
    async g => {
      g.hero('fogg');
      const withAouda = g.state.choices.aouda !== 'holland';
      const reef = g.told('squall:reef');
      await g.scene(SCENES.sea, { beat: 'squall' }, { beds: { storm: 0.5 } });
      const squall = g.beat('squall');
      await reef;
      await g.say('bunsby', 'A typhoon, sir. Head to sea — or she\'ll capsize');
      await squall;
      g.beds({ storm: 0.9 });
      await g.beat('typhoon', { wait: false });
      g.set('beat_next', withAouda ? 'aouda_storm' : 'shanghai');
      const r = await g.play(typhoon);
      if (r?.hours) g.hours(r.hours, tr('The typhoon'));
      if (withAouda) await g.beat('aouda_storm');
      g.beds({ storm: 0.3, sea: 0.4 });
      const gun = g.told('shanghai:gun'), turns = g.told('shanghai:turns');
      const shanghai = g.beat('shanghai');
      await g.say('bunsby', 'A steamer on the horizon! Flag at half-mast! The gun!');
      await gun;
      g.sound.cannon();
      await turns;
      await g.say('fogg', 'She is turning. For Yokohama');
      await shanghai;
    },
    // Yokohama: the Long Noses; Passepartout holds the pyramid; his master in the first row — drop or hold
    async g => {
      g.hero('pp');
      const announce = g.told('show:announce');
      await g.scene(SCENES.harbour, { beat: 'show', port: 'yokohama', evening: 1, night: 1, pp_wings: 1 }, { beds: { drums: 0.5, crowd: 0.5, town: 0.2 } });
      const show = g.beat('show');
      await announce;
      await g.say('batulcar', 'The Long Noses! The human pyramid!');
      await show;
      await g.beat('pyramid', { wait: false });
      const r = await g.play(pyramid);
      const choice = r?.choice ?? 'drop';
      g.state.choices.pyramid = choice;
      g.set('beat_next', choice === 'drop' ? 'see' : 'finish');
      g.mark('wings', true);
      g.beds({ crowd: 0.3, town: 0.2 });
      if (choice === 'drop') {
        await g.beat('see');
        const shout = g.told('collapse:batulcar');
        const collapse = g.beat('collapse');
        await shout;
        await g.say('batulcar', 'Who will pay for my Noses?');
        await g.say('fogg', 'I will');
        g.money(-200);
        g.sound.notes();
        await collapse;
      } else {
        const bow = g.told('finish:bow');
        const finish = g.beat('finish');
        await bow;
        g.sound.applause();
        await finish;
        g.hours(-1, tr('Till the act was over'));
        const face = g.told('reunion:face');
        const reunion = g.beat('reunion');
        await face;
        await g.say('passepartout', 'I held them up, master. They would have fallen');
        await g.say('fogg', 'The steamer leaves at half-past six');
        await reunion;
        g.relate('pp', 1);
      }
    },
    // the «General Grant»: Fix comes over — ~ punch or shake; the calendar: Wednesday again
    async g => {
      g.hero('pp');
      const fixCame = g.told('pacific:fix');
      await g.scene(SCENES.deck, { beat: 'pacific', ship: 'general_grant', port: 'none', pp_wings: 1 }, { beds: { sea: 0.5, clock: 0.15 } });
      const pacific = g.beat('pacific');
      await fixCame;
      await g.say('fix', 'Now I am on your side. As far as England, I am your best friend');
      await pacific;
      const punch = await g.choose('punch', {
        'passepartout#head': [{ id: 'punch', label: tr('Strike him') }],
        'fix#head': [{ id: 'shake', label: tr('Shake hands') }],
      });
      g.set('beat_next', punch === 'punch' ? 'punch' : 'shake');
      if (punch === 'punch') {
        const down = g.told('punch:down');
        const beat = g.beat('punch');
        g.set('beat_next', 'calendar');
        await down;
        g.sound.slap();
        await beat;
        g.relate('fix', -1);
        g.mark('bruise', true);
        await g.say('fix', 'I expected that. And now, on to England');
      } else {
        await g.beat('shake');
        g.relate('fix', 1);
      }
      g.hero('both');
      const leaf = g.told('calendar:leaf'), laugh = g.told('calendar:laugh');
      const calendar = g.beat('calendar');
      await leaf;
      await g.say('sailor', 'Wednesday again, gentlemen');
      await laugh;
      await g.say('passepartout', 'Two Wednesdays running! What a calendar these Americans keep!');
      await g.say('fogg', 'In my notebook it is Thursday');
      await calendar;
    },
  ],
};
