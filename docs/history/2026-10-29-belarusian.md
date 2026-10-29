# 2026-10-29 — Belarusian (`be`)

Why: Павел: ещё язык — белорусский.

- Worlds (`worlds/*`: `"be"` in `languages`, `lang/be.json`, every scene's `lang/be.json`, Scarlet Sails' module `modules/closeups.be.json`) and games (`games/*/bespoke/lang/be/strings.json`): «Вакол свету за 80 дзён», «Новы кінатэатр „Парадыза“», «Старэйшы сын», «Дама з сабачкам», «Пунсовыя ветразі».
- Names: Верн — Філеас Фог, Паспарту, Фікс, Ауда, Кіуні, «Танкадэра», Сэвіл-Роў; Тарнатарэ — Тото (kept so, not «Тато», which reads as «dad»), Альфрэда, Элена, Сальватарэ, Джанкальда, айцец Адэльфіа; Вампілаў — Бусыгін, Сарафанаў, Андрэй Рыгоравіч, Сільва, Ніна, Васенька, Кудзімаў; Чэхаў — Гураў, Ганна Сяргееўна, фон Дыдэрыц, С.; Грын — Асоль, Грэй, Лонгрэн, Эгль, Каперна, Ліс, «Сакрэт». The village's taunt is «Чырвоныя ветразі» (the Russian «Красные», the English «Red»), the book's sails «пунсовыя».

How it was checked: moood's `check` (its `be` branch: `be` in `i18n/languages.json`), `node packages/check/cli.js <repo> --write`
laid the files out, the translations were written into them, then `check` on the whole repository says «all right».
Modern standard Belarusian, the official orthography; translated from the English source, the Russian read beside it as
a second view of meaning and tone. Only translations and the `languages` lists were added; no source text, code or doc
was changed.
