# cast — the people of «Around the World» as the engine's people

A module for scenes with people (elements with `person`: `{"cast": "cast", "who": …}` — moood's
docs/agents/people.md). List it in a scene's `modules` with the others. The same people as the world v1's cast; a part's
lengths are a man's metres times `F.fit.h` (a share of a man's 1.76 m), a flame's colour glows (tone 2).

## Who

All in the world's style `around` (the engine's `flat`: straight-edged shapes, flat colours lit by the scene's own
light, no lines; the engine's face `simple` — eyes, brows, nose, mouth, at rest or as `<id>_mood` says — on a big head
(1.34, as «Cinema Paradiso»'s), the arms and legs fuller (limb 1.15): the faces read at a distance): as quiet as
the rooms they stand in. The Englishmen's hair is `kempt` (smoothed back from the brow to the nape).

- `fogg` — Phileas Fogg: about forty, tall and straight, fair hair and side-whiskers; a dark frock coat open over a white
  shirt-front and a black tie. Out of doors his top hat: `wear: {hat: 'tophat'}`. His gait `fogg_walk` — even, upright,
  the arms hardly swinging.
- `passepartout` — about thirty, broad-shouldered (an acrobat once), a round head, dark curls (`curls`); a short livery
  jacket of deep blue.
- `aouda` — young and slight, black hair in a knot; a sari of deep red, its end (`sari`: the pallu) from the right hip
  over the breast and the left shoulder, in gold.
- `fix` — short and thin, thick brows and whiskers; a bowler (`bowler`), a checked overcoat.
- The gentlemen of the Reform Club, in frock coats over white shirt-fronts: `stuart` (Andrew Stuart, the engineer:
  grey, broad, side-whiskers), `flanagan` (the brewer: stout, red-haired, a beard), `fallentin` (a banker: tall, thin,
  bald), `sullivan` (a banker: dark, clean-shaven), `ralph` (Gauthier Ralph of the Bank of England: old, white-haired).
- `porter` — the club's porter: a claret livery coat, grey hair.
- `cromarty` — Sir Francis Cromarty: a white uniform, a pith helmet (`helmet`), a grey moustache (`moustache`).
- `guide` — the Parsi guide: young and slight, a white turban (`turban`), a light tunic, barefoot.
- The procession and the crowd at the pyre: `priest` (a saffron robe, shaven), `bearer` (white tunic and dhoti, a
  turban, barefoot), `drummer` (the same, a red turban, a drum at the waist — `drum`), `villager`, `villager_woman`
  (a sari, her head covered).

- Chapter people: `consul` (Suez: a light frock coat, a pith helmet, whiskers); `owner` (Kiouni's owner: old, a white
  beard and turban, a dark cloak to the ground, barefoot); `trader` (Allahabad: stout, a saffron turban, a green robe, a
  red sash); `conductor` (the Indian line: a white jacket, a dark peaked cap); `bunsby` (the pilot: ruddy, a grey beard,
  a yellow sou'wester, a pea jacket, a pipe — point `pipe`, its bowl); `boatman` (Hong Kong: a wide conical straw hat, a
  blue jacket, barefoot; `with: ['lantern']`); `batulcar` (a top hat, a claret waistcoat over shirt-sleeves, long
  moustaches); `nose` (an acrobat of the Long Noses: tights, wings, the nose; point `nose` — its tip); `sailor` (a flat
  cap, a striped shirt); `speedy` (big, a red beard, a peaked cap, a pea jacket); `stoker` (no jacket, sleeves rolled,
  soot); `policeman` (a tall helmet, a dark tunic); `driver` (blue overalls, a cap, a beard); `captain` (Fort Kearney: a
  blue frock coat, a wide-brimmed hat); `soldier` (a sky-blue greatcoat, a kepi; `with: ['rifle']`); `mudge` (a fur coat
  and hat, a beard). The pastor is a voice only — not drawn.
- The Long Noses are told apart by their colours — each its `person.look: {colors: {top, bottom, accent}}` (the tights,
  the wings): blue `#3d5f9a`/gold `#e0b84a` (the cast's), green `#3f7a52`/white `#ece6d6`, black `#25242a`/red `#c8402e`,
  yellow `#d8a42c`/blue `#3d5f9a`, violet `#6a4a8a`/gold `#e0b84a`, white `#e8e2d4`/red `#c8402e`.

What the game's keys put on (`<id>_wear`, given the cast's object — never its name): `scene.kit.cast.wears.aouda_dress`
(Aouda's travelling dress from Hong Kong on: slate blue, the gold accent), `wears.fix_bruise` (Fix's bruise round an eye
— with his whiskers), `wears.pp_wings` (Passepartout's wings over his livery); the whole Long Nose costume —
`scene.kit.cast.characters.passepartout_nose` (red tights, gold wings, the nose). `null` — back to their own look.

Garments: `frockcoat` (to above the knee, straight), `sari`, `waistcoat` (over shirt-sleeves), `rolled` (no jacket, the
sleeves rolled up). Hair: `kempt`, `curls`. Hats: `tophat`, `bowler`, `turban`, `helmet`, `souwester`, `straw`
(conical), `sailorcap`, `custodian` (a constable's), `kepi`, `fur`; the engine's `cap`, `hat`.
Parts on a look: `shirtfront`, `whiskers`, `beard`, `moustache`, `mustachios`, `drum`, `chain` (a gold watch-chain across the
waistcoat), `sash`, `pipe`, `soot`, `bruise`, `stripes`, `wings`, `long_nose`. Aouda veiled: `wear: {hood: true}`; in her travelling dress: `wear: {garment: 'dress', colors: {…}}`.

Things in the hands (`<id>_with`): `watch` — a pocket watch open in the right palm, held to be read: its dial turned to
its owner's eyes (two hands on it, the lid open at its side, the bow and the chain to the waistcoat) — a camera over
their head or shoulder sees the dial; `watch_shut` — shut in the hand (point `watch`, both); `cards` — a hand of cards in the left hand; `newspaper` — open in both hands (point `paper`),
`newspaper_folded` — folded in the left; `bag` — the carpet bag (the twenty thousand) hanging from the right hand,
swinging (point `bag`); `bundle` — a cloth bundle hanging from the left hand; `badge` — Fix's gilt badge in the right palm
(point `badge`); `tophat_hand` — a top hat by its brim in the left hand; `torch` — a torch in the right hand, its head
glowing (point `flame`: its fire and light are the scene's — particles `{"kind": "fire", "at": "<who>#flame"}`, a light
`"at": "<who>#flame"`); `book` — a small book open in both hands (point `book`); `goad` — an elephant goad in the right
hand; `lantern` — a paper lantern hanging from a short pole in the right hand, glowing, swinging (point `flame`: a light
`"at": "<who>#flame"`); `rifle` — upright in the right hand, its butt by the foot; `plaid` — a plaid folded over the left
forearm (point `plaid`); `notebook` — Fogg's notebook open in both hands, a pencil in the right (point `book`);
`book_shut` — the book shut, flat in both hands (point `book`); `sugar` — a lump of sugar on the right palm (point
`sugar`); `sheet` — a rope in both hands, its end hanging from the left (point `sheet` — the right hand: the scene's own
rope runs to it). A part's point is the person's like the others (`"stuart#watch"`): for a look, a reach, the camera, a game.

## Motions (Kimodo's)

Seated on a chair (pelvis ≈ 0.59 m — a chair's): `cards` (a fan of cards in both hands before the chest; loop — start
each player at another `from`), `lay_cards` (once: lays the cards down and both hands flat on the table), `paper_seated`
(a newspaper open before the chest; loop), `talk_seated` (the folded paper on the lap, talking with small gestures of
the right hand; loop); `rise_chair` (once: up, the pelvis forward over the feet — nothing before the knees),
`rise_table` (once: pushes the chair back and stands up a step behind the seat — from a table).
Standing: `hands_behind` (hands clasped behind the back), `arms_folded`, `fidget_paper` (a paper at the waist, shifting
from foot to foot) (loops), `watch_look` (once: takes the watch out, looks at it, puts it back — `with: watch` from 0.7
to 2.9 s), `surprised` (once: both hands up, palms open), `strain` (straining forward, an arm out — held back).
On a bench (pelvis a chair's): `read_book`, `look_out` (leaning forward, hands on the knees), `sit_calm` (hands in the
lap), `sleep_seated` (leaning back, arms crossed, the head to one side) (loops); `gas_up` (once: up, a hand to the
forehead), `sit_down` (once: down onto a seat behind).
Kneeling and lying: `kneel_up` (on the knees, sitting back on the heels), `prostrate` (face down, the arms stretched
forward), `crouch_hide` (crouching low on the heels, a knee near the ground, the hands before the chest, shifting a little —
hiding), `lie_limp` (on the back, limp — also as carried: `on` another's hands).
Carrying someone in the arms: `carry_stand`, `carry_walk` (a gait: stiff, the arms forward — «as the dead»).
Gaits: `fogg_walk` (even, upright, the arms hardly swinging), `pp_walk` (quick and springy), `run`, `torch_walk` (a torch
held high in the right), `drum_walk`, `priest_walk` (bowed, hands joined), `stagger_walk` (dazed, the head hanging);
`stumble` (once: nearly falls, catches himself).
Holding the watch open before the chest is a reach (`reach: {r: a point before the chest}` with `with: ['watch']`);
putting a hat on is a reach to the own head (`reach: {r: '<id>#head'}`) and the hat put on (`wear`) as the hand is there.
