# shpic — the white spitz and the red leash

`kit.shpic.body(g, view)` paints the dog (`view`: `back` — lies facing away; `side` — stands, faces left), its origin at
its feet, metres. `kit.shpic.leash(g, view, mode)` paints the red `#a8322c` leash (mode `none` — nothing). An element
paints them as two layers (`body`, `leash`) so a shader may glow only the leash. Draft: only the views this scene needs.
