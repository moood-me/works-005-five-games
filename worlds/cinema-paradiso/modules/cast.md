# cast — the people of Cinema Paradiso

The people are figures made of figures, the world's style `paradiso` (the engine's `graphic`, the face `simple`: eyes,
brows, nose, mouth; the expression — `<id>_mood`). The motions are Kimodo's, kept in `cast.data.json` (`motions`), put
there by `put_motion`. One person at different ages is one element: `<id>_wear` = the object of the look
(`scene.kit.cast.characters.<name>`), not a name.

## The people (characters)

| name | who | base (`who`) |
|---|---|---|
| `toto_boy` | Totò, 8–10 | child |
| `toto_teen` | Totò, 17–18 | youth |
| `salvatore` | Salvatore, 47 | man |
| `alfredo` | Alfredo, about fifty (a cap, a waistcoat, a moustache, the point `alfredo#pocket`) | grandpa |
| `alfredo_blind` | Alfredo blind (dark glasses, a jacket, a cane) | grandpa |
| `maria` | Maria, about thirty (a widow) | woman |
| `maria_old` | Maria, about seventy | old |
| `elena` | Elena, 17 | woman |
| `elena_grown` | Elena, 47 | woman |
| `daughter` | Elena's daughter, 17 | woman |
| `adelfio` | Father Adelfio (a cassock, the bell) | old |
| `madman` | the madman, about thirty | man |
| `madman_old` | the madman at seventy (a beard) | old |
| `anna` | Anna, Alfredo's widow | old |
| `banker` | Elena's father (a suit, a hat) | man |
| `villager_m`, `villager_w`, `old_m`, `old_w`, `kid` | the crowd | man / woman / old / old / child |

## The parts — what is in the hands and on the face

`bell` the bell (right hand) · `cane` the cane (right hand, down to the floor) · `glasses` dark glasses · `pocket` the
point of the waistcoat's pocket (draws nothing) · `coins` coins on the right palm · `tin` the tin of film in both hands
at the chest · `tin_pocket` the tin in the pocket · `frame_hand` a frame of film in the right hand · `primer` a primer
in both hands · `slate_held` the slate in both hands at the height of the face · `paper_sheet` the paper in the right
hand · `letter_sheet` a letter in both hands before the eyes · `cam8` the 8 mm camera at the right eye in both hands ·
`chair_carried` a chair in both hands in front · `phone` the receiver at the ear in the right hand · `lamp_hand` a lamp
in the right hand (the scene's light — `<id>#lamp`) · `pencil` a pencil · `note` the note · `suitcase` a suitcase in the
right hand · `moustache` a moustache · `beard` a beard; a hat `kerchief` (a kerchief); clothes `waistcoat` (a
waistcoat).

## The motions (length in seconds; `loop` — goes round, `once` — one time)

Where the hands and the hips are, in the table — as the model made them, on the body of a person of their own height.

**From the base (not looked over again):** `run` 4 s, `sit_down` 3 s, `rise` 3 s, `seated` 10 s, `seated_hunched` 10 s,
`rise_chair` 3 s, `peek_lean` 8 s (once, held), `bench_work` 6 s (loop), `paint` 12 s, `wave` 4 s, `cane_walk`
6 s (loop, a walk), `carry_walk` 6 s, `give` 3 s, `take` 3 s, `kneel_down` 4 s, `sleep` (lying on the side, a loop: Alfredo lying in the smoke), `drag` 6 s, `doze` 10 s,
`sad_stand` 10 s, `read` 10 s, `sit_ground` 4.5 s, `stand_from_kneel` 3 s.

**New (2026-10-15, the branch `pd/motions`):**

| name | who | what the body does | s | |
|---|---|---|---|---|
| `phone_ear` | an old woman (`old`) | stands a little bent, the right hand at the ear; the hand rises in ~0.8 s and comes down in the last second — in a loop the hand drops and flies up again at the seam | 6 | loop (the seam shows) |
| `bell_ring` | the priest | sits on a chair (hips ~0.55 m), the right hand rises to the shoulder/chest, shakes, comes down; the hand never rises above the shoulder | 3 | once; begin from `seated` |
| `give_coins` | Alfredo | stands, the right hand forward and a little down, the hand at about the chest (not the waist), held all the time; the model does not show the palm up | 3 | once (held, does not change) |
| `seated_bowed` | a woman | sits, ~2.5 s upright, then the head and shoulders sink, the hands on the knees/on the table; ends bowed — NOT a loop, its end does not meet its beginning | 6 | once |
| `pour` | a woman | stands, the head down, both hands together in front at the table's height (about the waist); the jug does not tilt — it is "holds the jug over the table" | 3 | once |
| `push_turn` | Alfredo | leans hard forward, both arms straight forward at the shoulders, the knees bent: braces, pushes; no turning, hardly moves | 3 | once (a hold, in fact) |
| `fall_back` | Alfredo | shields his face with a hand, sinks, falls and lies on his back/side; the body goes to the floor, the legs toward where he looks | 3 | once; ends lying on the floor |
| `cough_stand` | the boy | bent forward, a fist/palm at the mouth, coughs; neither straightens nor crouches — only the bent cough | 1.5 | once |
| `walk_slow` | anyone | a slow walk, the arms along the body, the head bowed a little; a walk, goes forward | 4 | loop (a walk) |
| `cane_sit` | an old man | sits (hips ~0.55 m), the hands lie on the thighs by the knees, still; no cane between the knees — the part `cane` gives it | 6 | loop |
| `tell_hand` | an old man | sits, the right hand moves slowly in the air before the chest, the head bowed; at the beginning and the end the hand is at the knee — the seam is clean | 5 | loop |
| `film8` | a young man | stands, both arms bent at the face, the hands at the eyes (the camera `cam8`), sways gently; the hands at the face all the time | 6 | loop |
| `sit_step` | a young man | bends and sits low: the hips at the floor (~0.2 m), the knees up, the hands on the knees; ends sitting where a low step is | 4 | once; ends sitting |
| `carry_chair` | a young man | walks, both arms straight forward at the chest, wider than the shoulders (for the chair `chair_carried`); a walk forward | 3 | loop (a walk) |
| `chalk_mark` | a young man | sits (hips ~0.55 m), the left hand reaches out sideways and forward at the shoulder, a short movement, comes back; the left hand away from the body ~0.6 s | 2 | once; begin from `seated` |
| `pull_cover` | a young man | stands, leans to the table, both hands forward, and pulls toward the chest; ends with the hands at the chest, standing | 3 | once |
| `arms_wide_run` | a man | jogs, both arms spread out and down at ~45° (no higher than the waist/shoulders); a walk forward | 2 | loop (a walk) |
| `arms_wide` | a man | stands, both arms straight out sideways at the shoulders, still | 3 | loop |
| `lift_show` | Alfredo | both hands rise to the chest (the elbows bent, the hands at the chest/under the chin) and hold; they do not reach the face | 3 | once (held) |
| `lean_seated` | a man | sits (hips ~0.55 m), leans forward, the forearms on the thighs/knees, the head down, holds | 3 | once; ends leaning |
| `lean_back_seated` | a man | sits, hardly leans back at all: the palms behind the head, the body a little back, almost still | 3 | once (a pose, in fact) |

What a scene's author should know:
- Every walk (`walk_slow`, `carry_chair`, `arms_wide_run`) moves the body forward; none stays in its place.
- The seated ones start from the pose `seated` (a chair, hips ~0.55 m, facing where the standing ones face). `sit_step`
  is lower — the hips at the floor.
- The one lying at the end of `fall_back` and the one sitting at the end of `sit_step` stay in that pose till the next
  motion.
- The hands the model did not bring to what was meant (`give_coins`, `lift_show`, `pour`, `push_turn`, `seated_bowed`,
  `lean_back_seated`, `cough_stand`) are described as they are in this list; write the lines and the light for them,
  and let the scene's parts and inserts draw the things (the jug, a tray, cloth).
