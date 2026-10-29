# works-005: Brazilian Portuguese (2026-10-29)

Why: «Португальский (бразильский) еще запусти» — Pavel asked for Brazilian Portuguese as a further language. moood knows
`pt` (`Português (Brasil)`, locale `pt_BR`, its branch `pt`); this repository gets it on branch `pt`.

## What

- `"pt"` added to `"languages"` of the five worlds and five games; every pt file laid out by `check --write` and filled:
  the worlds' `lang/pt.json`, their scenes' `scenes/<folder>/lang/pt.json`, Scarlet Sails' `modules/closeups.pt.json`, the
  games' `bespoke/lang/pt/strings.json`. No game has other per-language data.
- Translated from the English, the Russian as a second view (the original's tone for Chekhov, Vampilov and Grin).
  Brazilian spelling and words (trem, ônibus, cinema, galpão); «você» for the player; lines written to be said aloud.
  Plurals: `one`, `many` («{n} de vezes»), `other`.
- Titles and names:
  - «A Volta ao Mundo em 80 Dias» (Júlio Verne): Phileas Fogg, Passepartout (says «monsieur»), Fix, Aouda, Kiouni, Sir
    Francis Cromarty, the Reform Club, Saville Row, the Tankadere, the Carnatic, the Henrietta, «os Narizes Compridos»;
    chapter subtitles as Verne's «em que…»; Fogg's notebook is «a caderneta», time in hand «folga»; Fogg's «Eu a amo».
  - «Cinema Paradiso»: Totò, Alfredo, Elena, Salvatore, padre Adelfio, Ciccio, Giancaldo; «signora», «mamma» kept Italian;
    the envelope «Palermo».
  - «O Filho Mais Velho» (Vampilov): Bussíguin, Sarafánov, Silva, Vássenka (Vássia), Volódia, Nina, Kudímov, Makárskaia;
    Bussíguin and Silva use «o senhor» to Sarafánov, he «você» to them; Sakhalin is «Sacalina».
  - «A Dama do Cachorrinho» (Tchekhov): Gúrov (Dmitri Dmítritch), Anna Serguéievna, von Diderits, Ialta, Oreanda, S., the
    «lulu-da-pomerânia», «Bazar Eslavo», «A Gueixa». «o senhor / a senhora» in Ialta and in S., «você» when they are
    close — as Chekhov's «вы / ты».
  - «Velas Escarlates» (Grin): Assol, Grey (as the shared name across repos; the English has Gray), Longren, Kaperna, Liss,
    Egle, Lílian, Gop, Letika, Panten, Hin Menners, Filipe, the galliot «Segredo»; the teasing «velas vermelhas» kept
    apart from the true «escarlates», «Menina do Navio» for «Корабельная»; the cask's drawn inscription translated
    («Grey me beberá / quando estiver / no paraíso»), as in Russian and French.
- Drawn signs translated like the French and Spanish: NOVEMBRO / QUARTA-FEIRA, LOTADO, DEMOLIÇÃO / SÁBADO, BILHETERIA,
  «Destinatário mudou-se».

## Checked

`node moood-pt/packages/check/cli.js .` — «all right — 1309 texts in 67 scopes». The games' own checks play the English
only and were not run for pt.
