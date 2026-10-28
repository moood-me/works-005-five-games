# cast — the people of “Scarlet Sails” as the engine's people

A module for scenes with people (elements with `person`: `{"cast": "cast", "who": …}` — the engine's docs/agents/people.md). In
the scene's `modules` — beside the rest (`beats` — the film in beats). 30 looks, 23 parts, 61 motions. The parts'
lengths are a man's metres, multiplied by `F.fit.h` (the height as a share of 1.76 m).

## Style

`sails` — the engine's flat geometry (`flat`): straight edges, clean colours, the light and the shadows the scene's (`paint: lit`), a fine
line. Like the whole world: modern, fine, minimal; faces are dots (the close-ups are not the engine's people).

## Who

- `assol_child` — Assol, eight years old: slight, sunburnt, dark tousled hair, a short faded cotton
  frock (`frock`), barefoot.
- `assol` — Assol, seventeen: not tall, slender, dark hair under a light kerchief (`kerchief`), a plain light
  dress, barefoot. The same Assol years later — `<id>_wear: cast.characters.assol` on the girl's element.
- `longren` — Longren: big, heavy, a greying beard (`beard`), a dark sea jacket, a cap.
- `grey` — Gray, the captain: tall, lean, weather-beaten, a dark blue frock coat (`frockcoat`), no hat.
- `grey_boy` — Gray at eight: fair hair, a velvet jacket. `grey_teen` — a ship's boy of fifteen: canvas clothes, barefoot.
- `lilian` — Lilian Gray, the mother: slender, pale, a dark dress, her hair in a knot; `lilian_black` — the same in mourning, all
  in black. `grey_shirt` — Gray without his frock coat: a white shirt (a look through `<id>_wear`, when he takes the coat off).
- `letika` — Letika, a sailor: lean, merry, his cap askew. `sailor` — a sailor of the Secret. `panten` — Panten, the mate:
  round, a buttoned frock coat. `gop` — Gop, the boatswain of the Anselm.
- `hin` — Hin Menners, the innkeeper: heavy, an apron. `filipp` — Philip the collier: big, black with coal dust,
  a cap, a beard. `egl` — Egle: a tall lean old man, a white beard, a straw hat. `merchant` — a merchant in Liss.
- Kaperna: `fisher` (a fisherman), `woman` (a woman in a kerchief), the children `kid_boy`, `kid_girl`, `kid_small`, `girl` — a little
  girl Assol may give the yacht to.
- Kaperna's past: `mary` — Mary, Assol's mother: young, slender, dark hair under a kerchief, a dark dress; a baby
  (`baby`) — a part of her look, always with her. `menners` — the elder Menners: like `hin`, older, balding, a waistcoat
  (`waistcoat`) over his shirt. `longren_young` — Longren with a dark beard and hair (a look through `<id>_wear`).
- `filipp_bare` — Philip without his cap (through `<id>_wear`, when he has taken it off; the cap in his hand — the part `cap_hand`).
- The musicians: `zimmer` — Zimmer, the violinist: lean, long hair, a dark frock coat; `musician` — a musician in a dark jacket
  and a cap; `cellist` — a cellist: stocky, bearded, a dark frock coat. The instruments are parts (`violin`, `cello`), given
  by the scene (`<id>_with`).

## Things (the cast's parts: `<id>_with`, or a look's `parts`)

`yacht` — Longren's toy yacht with scarlet sails in both hands, between them; `yacht_r` — in the right hand. `knife` —
a knife in the right hand. `pipe` — a pipe in the right hand. `book` — an open book in both hands, its pages to the eyes. `basket` — a basket
of toys hanging from the right hand (it swings); `baskets` — the collier's two empty baskets. `chest_shoulder` — Longren's
chest on his right shoulder. `rod` — a fishing rod forward over the water, the line hanging straight down. `ring` — a ring between the fingers of the right hand;
`ring_old` — there too, an old man's ring, broader and darker; `ring_cord` — a ring on a cord on the breast, over the dress.
`brush` — a brush in the right hand, `paints` — a box of paints in the left. `bundle` — a bundle in the right hand. `candle` — a candle in a candlestick
in the right hand: the flame glows by itself, the light is the scene's (`"at": "<id>#flame"`). `letter` — an open letter in both hands. `beard` —
a beard (a look's).

`baby` — a baby in a shawl in both arms at the breast: it lies from the right wrist to the crook of the left arm, the head there. `violin` —
a violin by its neck in the left hand and the bow in the right: standing, they hang along the legs, sitting, they lie across the knees (the part sees for itself
whether the person sits — by the height of the pelvis above the feet). `cello` — a cello upright on the floor to the left, the left hand on its neck.
`cap_hand` — a cap in the right hand at the breast, the colour of the look's cap (`colors.hat`). `oars` — two oars in the hands of someone sitting, each
to its own side of the hand, the blades over the water.

A part named in `<id>_with` is added to the look's parts (the beard stays); one named twice is drawn once.

The parts' points (the person's points, like `#hand_r`: for a gaze, a hand, the camera, the game): `#yacht` (the middle of the yacht's sails),
`#book`, `#letter`, `#ring` (`ring` and `ring_old` have the same one; `ring_cord` has no point), `#pipe` (the pipe's bowl: smoke is the scene's particles from there), `#flame` (the candle), `#basket` (the top
of the basket). A point is there while the person has the part (`<id>_with`).

## Motions (Kimodo; a child moves like a small grown-up)

Standing: `carve` (whittles with a knife at the workbench, a loop), `lay_down` (lays something on the table with the right hand), `shelve` (puts a thing on a
high shelf with both hands), `pipe` (stands with a pipe at the mouth, a loop), `light_pipe` (lights a pipe), `push_foot` (pushes
a box on the floor with a foot), `put_basket` (puts a basket on the floor), `tell` (a child tells with her hands: this big, over there),
`point_laugh` (points a finger and laughs), `crouch_put` (crouches and puts a thing on the ground at the feet), `wave` (waves
a hand), `beckon` (beckons with a hand), `pick_up` (takes from the table), `coat_off` (takes off the frock coat), `hide_ring` (takes the ring off and
hides it on a cord under the dress); loops: `hands_behind` (hands behind the back), `sad_stand` (stands with the head bowed), `helm` (at the
wheel, hands on the spokes), `read_stand` (reads standing), `paint` (paints with a brush on the wall).
Gaits: `drag` (backs away, dragging something heavy with the hands in front), `run` (a run), `carry_chest` (walks with a chest on the shoulder),
`careful` (creeps, stepping carefully).
Sitting (on a chair, the pelvis at 0.57 m for a man — the seat through `<id>_on`): `seated` (sits at rest, a loop), `read` (a book in the
hands, a loop), `doze` (sits, the head lowered, a loop), `turn_knife` (turns a knife about), `eat` (eats at the table, a loop), `fish`
(with a fishing rod at the edge, a loop); once: `sit_down` (sits down), `hop_down` (slides off a high stool onto the feet),
`wake_up` (starts and gets up).
On the ground: `sit_ground` (sits down on the sand), `hug_knees` (sits hugging the knees, a loop), `head_on_knees` (the head on the
knees, a loop), `sleep` (sleeps on the side, a loop), `wake_sit` (wakes and sits up), `sit_look` (sits on the ground,
looks into the distance, a loop), `sew` (sews, sitting on the deck, a loop), `stand_from_kneel` (gets up from the knees); `kneel_down` and
`kneel_rise` (carefully kneels down, the back straight, — and gets up).

For the game (2026-10-11). Standing: `turn_toy` (an old man, bent, turns a small thing in both hands at his breast and looks it over,
a loop), `tell_sea` (raises the right hand forward to shoulder height, holds it, pointing into the distance, lowers it), `give` (holds out
a thing forward in both hands at waist height and lowers the hands), `hands_hips` (hands on the hips, a loop), `nod_aside` (nods to the left with the body and
the head and straightens up, the hands down), `shake_head` (shakes the head and spreads the hands, palms up),
`baby_stand` (stands, the hands folded at the breast — the baby in them, — rocking a little, a loop), `whisper` (leans FORWARD,
the right palm at the mouth, whispers, straightens up: the scene turns her to her neighbour — `<id>_turn`), `sway` (stands, the hands down,
sways smoothly from side to side — a palm's width each way, a loop), `sort` (takes a thing before her with the right hand and
puts it aside to the right, twice, a loop), `push_away` (leaning, pushes something away with both hands and straightens up),
`take_down` (reaches up with both hands, takes something down and puts it before her at waist height), `put_up` (puts something with both
hands before her at waist height and straightens up), `hold_up` (holds a long thing on open palms at the breast,
still, a loop), `halt` (runs, stops short and stands).
Gaits: `baby_walk` (walks slowly, bent, the head lowered, the hands folded at the breast), `run_high` (runs with a wide
stride, both hands raised forward and up over the head).
On the knees: `wave_help` (on both knees, both hands flung up over the head, waving, a loop).
