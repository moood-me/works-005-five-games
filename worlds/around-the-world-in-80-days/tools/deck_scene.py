# writes scenes/deck/scene.json (the spec; code lives in elements/, lib.js, script.js, showcase.js)
import json, sys
OUT = sys.argv[1]
PARTS = ['deckhouse', 'boats', 'bunks', 'yards', 'mast_fore', 'mast_main', 'bulwarks', 'speedy_cabin']
# each part as the meanings name it, and its verb (where it is / where they are)
PART_NAME = {'deckhouse': ('the deckhouse', 'is'), 'boats': ('the boats', 'are'), 'bunks': ('the bunks (a stack by the hatch)', 'are'),
             'yards': ('the yards', 'are'), 'mast_fore': ('the foremast', 'is'), 'mast_main': ('the mainmast', 'is'),
             'bulwarks': ('the bulwarks', 'are'), 'speedy_cabin': ("the captain's cabin", 'is')}
HOME = {'deckhouse': [0, 18], 'boats': [-2.6, 15.8], 'bunks': [3.4, 12.4], 'yards': [0, 11], 'mast_fore': [0, 34], 'mast_main': [0, 11],
        'bulwarks': [0, 0], 'speedy_cabin': [-3, 7]}
PEOPLE = [('fogg', 'Phileas Fogg', 'fogg'), ('passepartout', 'Passepartout', 'passepartout'), ('aouda', 'Aouda', 'aouda'), ('fix', 'Fix', 'fix'),
          ('consul', 'Consul', 'consul'), ('sailor', 'Sailor', 'sailor'), ('speedy', 'Captain Speedy', 'speedy'), ('stoker', 'Stoker', 'stoker'),
          ('policeman', 'Constable', 'policeman'), ('policeman_2', 'Constable', 'policeman')]

def part_place(p):
    return {'across': f'at_{p}_a', 'distance': f'at_{p}_d', 'elevation': f'at_{p}_e'}

objects = [
    {'id': 'sky', 'name': 'Sky', 'sky': True},
    {'id': 'sea', 'name': 'Sea', 'plane': True, 'across': 0, 'distance': 600, 'elevation': -5.5, 'width': 6000, 'depth': 4000,
     'reflect': {'strength': 0.5, 'fade': 0, 'rough': 0.55, 'ripple': 0.35}, 'uniforms': {'phase': 0, 'caps': 0.5}},
    {'id': 'port_far', 'name': 'Port on the horizon', 'across': 560, 'distance': 1500, 'elevation': -5.5, 'box': [-1100, -130, 1100, 2]},
    {'id': 'china', 'name': "The China's smoke on the horizon", 'across': -260, 'distance': 2200, 'elevation': -5.5, 'box': [-60, -150, 260, 2]},
    {'id': 'quay', 'name': 'Quay', 'plane': True, 'across': 30, 'distance': 30, 'elevation': -2.6, 'width': 48, 'depth': 160},
    {'id': 'sheds', 'name': 'Warehouses on the quay', 'across': 42, 'distance': 110, 'elevation': -2.6, 'facing': 270, 'box': [0, -36, 166, 0.2]},
    {'id': 'gangway', 'name': 'Gangway', 'plane': True, 'across': 7.35, 'distance': 9.7, 'elevation': -1.3, 'width': 1.1, 'depth': 4.69,
     'rotation': 270, 'tilt': 33.7, 'walk': True},
    {'id': 'deck', 'name': 'The deck', 'plane': True, 'across': 0, 'distance': 21, 'elevation': 0.005, 'width': 11.2, 'depth': 52},
    # the bulwarks: an anchor the burn moves; the port side's (the part's point) and the starboard's on it
    {'id': 'bulwarks_at', 'name': 'Bulwarks (site)', 'unseen': True, 'across': 0, 'distance': 0, 'place': part_place('bulwarks')},
    {'id': 'bulwarks', 'name': 'Port bulwarks', 'on': 'bulwarks_at', 'across': -5.45, 'distance': -5, 'facing': 90, 'box': [-0.2, -1.25, 52.2, 0.1]},
    {'id': 'bulwarks_s', 'name': 'Starboard bulwarks', 'on': 'bulwarks_at', 'across': 5.45, 'distance': 47, 'facing': 270, 'box': [-0.2, -1.25, 52.2, 0.1]},
    # what stays when the bulwarks burn: the iron sheer strake and stanchions
    {'id': 'gunwale', 'name': 'Iron side, port', 'across': -5.5, 'distance': -5, 'facing': 90, 'box': [-0.2, -0.5, 52.2, 0.1]},
    {'id': 'gunwale_s', 'name': 'Iron side, starboard', 'across': 5.5, 'distance': 47, 'facing': 270, 'box': [-0.2, -0.5, 52.2, 0.1]},
    {'id': 'bow', 'name': 'Bow', 'across': 0, 'distance': 47.2, 'box': [-6, -6, 6, 0.2]},
    {'id': 'spray', 'name': 'Spray at the stem', 'particles': {'kind': 'splashes', 'at': [0, 50, -4.8], 'amount': 'speed', 'rate': 26,
     'source': [3.2, 1, 0.2], 'direction': [0, 0, 1], 'spread': 50, 'speed': [2, 4.5], 'life': [0.8, 1.6], 'size': [0.18, 0.4], 'color': '#eef4f4'}},
    # the captain's cabin (the «Henrietta»; the others' after skylight)
    {'id': 'cabin', 'name': "Captain's cabin (site)", 'unseen': True, 'across': -3, 'distance': 7, 'place': part_place('speedy_cabin')},
    {'id': 'speedy_cabin', 'name': "Captain's cabin", 'on': 'cabin', 'facing': 180, 'box': [-1.55, -2.6, 1.55, 0.1]},
    {'id': 'speedy_cabin_side', 'name': "Captain's cabin, side", 'on': 'cabin', 'across': 1.5, 'facing': 90, 'box': [-0.1, -2.6, 3.7, 0.1]},
    {'id': 'cabin_roof', 'name': 'Cabin roof', 'plane': True, 'on': 'cabin', 'distance': 1.8, 'elevation': 2.3, 'width': 3.1, 'depth': 3.7, 'walk': True},
    # the deckhouse, its bridge on the roof, the calendar on its aft face
    {'id': 'house', 'name': 'Deckhouse (site)', 'unseen': True, 'across': 0, 'distance': 18, 'place': part_place('deckhouse')},
    {'id': 'deckhouse', 'name': 'Deckhouse', 'on': 'house', 'facing': 180, 'box': [-2.3, -2.6, 2.3, 0.1]},
    {'id': 'deckhouse_side', 'name': 'Deckhouse, starboard side', 'on': 'house', 'across': 2.3, 'facing': 90, 'box': [-0.1, -2.6, 8.3, 0.1]},
    {'id': 'deckhouse_port', 'name': 'Deckhouse, port side', 'on': 'house', 'across': -2.3, 'distance': 8.2, 'facing': 270, 'box': [-0.1, -2.6, 8.3, 0.1]},
    {'id': 'house_roof', 'name': 'Bridge on the deckhouse', 'plane': True, 'on': 'house', 'distance': 4, 'elevation': 2.4, 'width': 4.6, 'depth': 8.2, 'walk': True},
    {'id': 'bridge_rail', 'name': 'Bridge rail', 'on': 'house', 'distance': 0.15, 'elevation': 2.4, 'facing': 180, 'box': [-2.5, -1.3, 2.5, 0.05]},
    {'id': 'calendar', 'name': 'Calendar on the deckhouse', 'on': 'house', 'across': -1.2, 'distance': -0.04, 'elevation': 1.62, 'facing': 180, 'box': [-0.32, -0.44, 0.32, 0.04]},
    {'id': 'funnel', 'name': 'Funnel', 'across': 0, 'distance': 22.5, 'box': [-1.4, -11.4, 1.4, 0.1]},
    {'id': 'smoke_p', 'name': 'Smoke from the funnel', 'particles': {'kind': 'smoke', 'at': 'funnel#top', 'amount': 'smoke', 'rate': 4, 'life': [14, 22],
     'source': [0.9, 0.9, 0], 'speed': [2.2, 3.2], 'spread': 14, 'gravity': -0.15, 'drag': 0.3, 'wind': 1.4, 'size': [1.6, 9], 'color': ['#5a5652', '#9a9690'],
     'opacity': 0.75, 'shadow': 0.4}},
    {'id': 'sparks_p', 'name': 'Sparks from the funnel', 'particles': {'kind': 'sparks', 'at': 'funnel#top', 'amount': 'fire', 'rate': 30, 'speed': [3, 7], 'spread': 30, 'direction': [0, 0, 1], 'wind': 1}},
    {'id': 'mast_main', 'name': 'Mainmast', 'across': 0, 'distance': 11, 'box': [-5.8, -25.6, 5.8, 0.2], 'place': part_place('mast_main')},
    {'id': 'mast_fore', 'name': 'Foremast', 'across': 0, 'distance': 34, 'box': [-5.8, -23.6, 5.8, 0.2], 'place': part_place('mast_fore')},
    {'id': 'yards_at', 'name': 'Yards (site)', 'unseen': True, 'across': 0, 'distance': 11, 'place': part_place('yards')},
    # the yards and their sails: the foremast's (the part's point, on its lower yard's arm) and the mainmast's, on one anchor
    {'id': 'yards', 'name': 'Foremast yards and sails', 'on': 'yards_at', 'distance': 23, 'box': [-8, -22.6, 8, -1.5], 'translucent': 0.4},
    {'id': 'yards_main', 'name': 'Mainmast yards and sails', 'on': 'yards_at', 'box': [-8, -24.6, 8, -1.5], 'translucent': 0.4},
    {'id': 'hatch', 'name': 'Stokehold hatch', 'across': 1.4, 'distance': 13.8, 'box': [-1.0, -1.55, 1.0, 0.05]},
    {'id': 'hatch_glow', 'name': 'Fire in the hatch', 'plane': True, 'across': 1.4, 'distance': 14.6, 'elevation': 0.66, 'width': 1.5, 'depth': 1.5, 'glows': True},
    {'id': 'hatch_fire', 'name': 'Flames from the hatch', 'particles': {'kind': 'fire', 'at': 'hatch#fire', 'amount': 'fire', 'size': [0.7, 0.15], 'source': [1.1, 1.1, 0], 'rate': 40}},
    {'id': 'flare_p', 'name': 'Flare in the hatch', 'particles': {'kind': 'sparks', 'at': 'hatch#fire', 'burst': {'on': 'flare', 'count': 160, 'over': 0.4},
     'speed': [3, 8], 'spread': 40, 'direction': [0, 0, 1]}},
    {'id': 'bunks', 'name': 'Bunks', 'across': 3.4, 'distance': 12.4, 'box': [-1.2, -1.6, 1.2, 0.1], 'place': part_place('bunks')},
    {'id': 'boats', 'name': 'Port boat', 'across': -2.6, 'distance': 15.8, 'box': [-2.6, -2.1, 2.6, 0.1], 'place': part_place('boats')},
    {'id': 'boats_s', 'name': 'Starboard boat', 'on': 'boats', 'across': 5.6, 'distance': 1.2, 'facing': 180, 'box': [-2.6, -2.1, 2.6, 0.1]},
    {'id': 'paddle_box', 'name': 'Paddle-boxes', 'across': 5.45, 'distance': 20, 'facing': 270, 'box': [-5.6, -6.8, 5.6, 0.1],
     'copies': [{'across': 5.45, 'distance': 20, 'facing': 270}, {'across': -5.45, 'distance': 20, 'facing': 90}]},
    {'id': 'walking_beam', 'name': 'Walking-beam', 'across': 0, 'distance': 24.8, 'box': [-3, -10.5, 3, 0.1]},
    {'id': 'lantern', 'name': 'Lantern at the rail', 'across': 4.75, 'distance': 11.3, 'box': [-0.5, -3, 0.5, 0.1]},
    {'id': 'deckchair', 'name': 'Deck-chair', 'across': -2.2, 'distance': 14.35, 'facing': 150, 'box': [-0.45, -1.05, 0.45, 0.05]},
    # points the operator frames: between the people of a moment
    # (each 2 m tall, its box round its anchor: the operator frames the anchor; a shot of 1 frames 2 m there)
    {'id': 'suez_two', 'name': 'Passepartout and Fix at Suez', 'unseen': True, 'across': 3.3, 'distance': 10.4, 'elevation': 1.45, 'box': [-1, -1, 1, 1]},
    {'id': 'fix_consul', 'name': 'Fix and the consul', 'unseen': True, 'across': 1.95, 'distance': 13.85, 'elevation': 1.5, 'box': [-1, -1, 1, 1]},
    {'id': 'night_two', 'name': 'Two at the rail', 'unseen': True, 'across': 4.2, 'distance': 10.25, 'elevation': 1.45, 'box': [-1, -1, 1, 1]},
    {'id': 'two_pacific', 'name': 'Passepartout and Fix', 'unseen': True, 'across': 4.0, 'distance': 10.5, 'elevation': 1.45, 'box': [-1, -1, 1, 1]},
    {'id': 'calendar_three', 'name': 'At the calendar', 'unseen': True, 'across': -1.0, 'distance': 15.4, 'elevation': 1.3, 'box': [-1, -1, 1, 1]},
    {'id': 'ny_two', 'name': 'Fogg below the bridge, Speedy on it', 'unseen': True, 'across': 1.5, 'distance': 17.0, 'elevation': 2.6, 'box': [-1, -1, 1, 1]},
    {'id': 'coal_three', 'name': 'At the hatch', 'unseen': True, 'across': 0.4, 'distance': 12.6, 'elevation': 1.4, 'box': [-1, -1, 1, 1]},
    {'id': 'bridge_two', 'name': 'On the bridge', 'unseen': True, 'across': 0.1, 'distance': 19.4, 'elevation': 4.0, 'box': [-1, -1, 1, 1]},
    {'id': 'lv_two', 'name': 'Fogg and Fix at the gangway', 'unseen': True, 'across': 3.5, 'distance': 10.4, 'elevation': 1.5, 'box': [-1, -1, 1, 1]},
    # inserts
    {'id': 'porthole', 'name': 'Speedy at the porthole', 'insert': 'porthole', 'iris': [0.889, 0.5, 0.46, 0.46]},
    {'id': 'cell_close', 'name': 'Bench in the cell', 'insert': 'cell_close'},
    # the custom house's cell, far off to starboard
    {'id': 'cell', 'name': 'Cell (site)', 'unseen': True, 'across': 400, 'distance': 0},
    {'id': 'cell_floor', 'name': 'Cell floor', 'plane': True, 'on': 'cell', 'distance': 3, 'elevation': 0.01, 'width': 7.2, 'depth': 6.4, 'inside': True},
    {'id': 'cell_back', 'name': 'Cell wall with a window', 'on': 'cell', 'distance': 6, 'facing': 180, 'box': [-3.7, -5.4, 3.7, 0.1], 'inside': True},
    {'id': 'cell_left', 'name': 'Cell wall with the door', 'on': 'cell', 'across': -3.5, 'distance': -0.6, 'facing': 90, 'box': [-0.1, -5.4, 6.8, 0.1], 'inside': True},
    {'id': 'cell_right', 'name': 'Cell wall', 'on': 'cell', 'across': 3.5, 'distance': 6.2, 'facing': 270, 'box': [-0.1, -5.4, 6.8, 0.1], 'inside': True},
    {'id': 'cell_two', 'name': 'Fogg on the bench and Fix', 'unseen': True, 'on': 'cell', 'across': -0.8, 'distance': 4.5, 'elevation': 1.1, 'box': [-1, -1, 1, 1]},
    {'id': 'cell_bench', 'name': 'Bench', 'on': 'cell', 'across': -0.2, 'distance': 5.05, 'facing': 180, 'box': [-1.3, -0.6, 1.3, 0.05], 'inside': True},
    {'id': 'cell_door', 'name': 'Cell door', 'on': 'cell', 'across': -3.45, 'distance': 1.55, 'facing': 90, 'box': [-0.05, -2.2, 1.1, 0.05],
     'place': {'facing': 'door_f'}, 'inside': True},
]
for pid, ru, who in PEOPLE:
    objects.append({'id': pid, 'name': ru, 'person': {'cast': 'cast', 'who': who}, 'across': -2, 'distance': -3,
                    'place': {'across': f'{pid}_a', 'distance': f'{pid}_d'}, 'shadow': True})

state = {'beat': None, 'beat_next': None, 'ship': 'mongolia', 'port': 'suez', 'night': 0, 'dawn': 0, 'fog': 0, 'smoke': 1, 'speed': 0, 'sails': 0,
         'fire': 0, 'flare': 0, 'flare_glow': 0, 'speedy_grief': 0, 'porthole': 0, 'cell_close': 0, 'cell_time': 0, 'release': None,
         'door': 0, 'door_f': 90, 'leaf': 0, 'with_aouda': 0, 'with_pp': 1, 'with_fix': 0, 'fix_bruise': 0, 'pp_wings': 0, 'aouda_dress': 0}
states = {
    'beat': {'type': 'string', 'means': 'the beat of the film the game plays (the module beats; notes.md lists them)'},
    'beat_next': {'type': 'string', 'means': 'the beat the game will play next (its opening made ready ahead)'},
    'ship': {'values': ['mongolia', 'rangoon', 'general_grant', 'henrietta'], 'means': "the ship: mongolia — P&O, a black funnel, white bulwarks, a teak deckhouse; rangoon — the same look (night — the key night); general_grant — an American paddle-steamer: a white deckhouse, a red funnel, the paddle-box at the side, the engine's walking-beam; henrietta — an iron screw-steamer with two masts and yards, a wooden deckhouse, bulwarks, the captain's cabin on the poop (the parts burn — «The boilers»). Changed on a cut"},
    'port': {'values': ['suez', 'bombay', 'new_york', 'queenstown', 'liverpool', 'none'], 'means': 'the port on the horizon on the starboard bow: suez — minarets, palms, a mole, a quay and a gangway at the side; bombay — the town and hills (at dawn); new_york — a waterfront, a quay and a gangway; queenstown — the green hills of Ireland; liverpool — docks, cranes, brick, a quay and a gangway; none — the open sea'},
    'night': {'range': [0, 1], 'smooth': True, 'means': "night: the moon on the right, the moon's path, the lantern at the rail burning"},
    'dawn': {'range': [0, 1], 'smooth': True, 'means': 'dawn: a low sun on the starboard bow, a pink sky'},
    'fog': {'range': [0, 1], 'smooth': True, 'means': 'fog (Liverpool)'},
    'smoke': {'range': [0, 1], 'smooth': True, 'means': 'how much the funnel smokes: 1 — under steam, 0.2 — no coal, 0 — the fires out'},
    'speed': {'range': [0, 1], 'smooth': True, 'means': 'way: the water running past the side, whitecaps, spray at the bow (0 — standing)'},
    'sails': {'range': [0, 1], 'smooth': True, 'means': 'the Henrietta: the sails on the yards, 0 — furled, 1 — all set'},
    'fire': {'range': [0, 1], 'smooth': True, 'means': 'the fire in the furnace: flames from the stokehold hatch, its light, sparks from the funnel («The boilers»)'},
    'flare': {'type': 'number', 'means': 'a flare in the hatch: each new number — a sheaf of sparks (set by the scene as a part goes into the hatch; the game may set it too)'},
    'flare_glow': {'range': [0, 1], 'smooth': True, 'means': 'the light of the flare in the hatch (led by the scene together with flare)'},
    'speedy_grief': {'range': [0, 1], 'smooth': True, 'means': 'Speedy clutches his head: from 0.4 — hands to the head, the face angry; from 0.8 — grief'},
    'porthole': {'range': [0, 1], 'smooth': True, 'means': "insert: Speedy at his cabin's porthole close up, red beard, roaring (0 — shut)"},
    'cell_close': {'range': [0, 1], 'smooth': True, 'means': "insert: the bench of the custom-house cell, Fogg's watch open on it, his hands on his knees (0 — shut)"},
    'cell_time': {'range': [0, 1], 'smooth': True, 'means': "the bars' shadow creeps over the floor and the bench: 0 — morning, 1 — three hours later (led by the game)"},
    'release': {'values': [None, 'down', 'hand'], 'means': 'how the beat release ends, if set before it: down — Fogg strikes, Fix falls; hand — hand in hand; null — the beat ends at release:in'},
    'door': {'range': [0, 1], 'smooth': True, 'means': "the cell's door: 0 — locked, 1 — flung open"},
    'door_f': {'range': [0, 180], 'smooth': True, 'means': "the cell door's turn, degrees (led by the scene by door; the game is not to touch it)"},
    'leaf': {'range': [0, 1], 'smooth': True, 'means': "the calendar's leaf on the deckhouse: 0 — «Wednesday», 1 — turned over, under it «Wednesday» again"},
    'with_aouda': {'values': [0, 1], 'means': 'Aouda on the voyage (New York, Liverpool)'},
    'with_pp': {'values': [0, 1], 'means': 'Passepartout on the voyage (New York, «The boilers», Liverpool)'},
    'with_fix': {'values': [0, 1], 'means': 'Fix on the voyage (New York)'},
    'fix_bruise': {'values': [0, 1], 'means': "Fix's bruise (as the cast gives it)"},
    'pp_wings': {'values': [0, 1], 'means': "Passepartout in the Long Noses' wings (as the cast gives them)"},
    'aouda_dress': {'values': [0, 1], 'means': 'Aouda in a travelling dress (from Hong Kong)'},
}
for p in PARTS:
    name, verb = PART_NAME[p]
    states[p] = {'values': [0, 1], 'means': f'the Henrietta, {name}: 1 — in place, 0 — burnt (gone into the hatch with a flare)'}
    states[f'drag_{p}'] = {'range': [0, 1], 'smooth': True, 'means': f'{name}: 0 — in place, 1 — dragged to the hatch (shrinking on the way; a mast falls first)'}
    states[f'locked_{p}'] = {'values': [0, 1], 'means': f'{name}: 1 — beyond the purse (dimmer, as if not one\'s own)'}
    for k in 'ade':
        states[f'at_{p}_{k}'] = {'type': 'number', 'smooth': True, 'means': f'where {name} {verb} (led by the scene by drag_{p}; the game is not to touch it)'}
    state[p] = 1
    state[f'drag_{p}'] = 0
    state[f'locked_{p}'] = 0
    h = HOME[p]
    state[f'at_{p}_a'] = h[0]
    state[f'at_{p}_d'] = h[1]
    state[f'at_{p}_e'] = 0
for pid, _, _ in PEOPLE:
    state[f'{pid}_a'] = -2
    state[f'{pid}_d'] = -3
    state[f'{pid}_here'] = False

spec = {
    'engine': 3,
    'title': 'The deck',
    'caption': "A steamer's deck at the rail: the sea, smoke from the funnel, a port on the horizon.",
    'horizon': 0.45,
    'camera': {'mode': 'walk', 'area': [-5, 5, -6, 30]},
    'modules': ['light', 'cast', 'beats'],
    'relief': "return across > 300 ? 0 : across > 5.7 ? -2.6 : across < -5.7 ? -5.5 : 0;",
    'light': {'vignette': 0.35, 'grain': 0.06, 'ambient': 1.0, 'ambientColor': '#f2f0ea', 'haze': 0.05, 'hazeColor': '#d2dee4', 'hazeGlow': 0.7,
              'shafts': 0.1, 'saturation': 1.0, 'wind': [-0.25, -1, 0.9], 'inside': 0.55,
              'looks': {
                  'dawn': {'ambient': 0.85, 'ambientColor': '#f2cdb8', 'tint': '#ff9a70', 'tintStrength': 0.12, 'haze': 0.1, 'hazeColor': '#ecc0a6', 'shafts': 0.35, 'lights': {'sun_day': 0.15}},
                  'night': {'ambient': 0.78, 'ambientColor': '#8a9cd0', 'haze': 0.08, 'hazeColor': '#1e2a46', 'saturation': 0.82, 'shafts': 0.45, 'lights': {'sun_day': 0, 'sun_dawn': 0}},
                  'fog': {'haze': 0.5, 'hazeColor': '#c6c8c4', 'ambient': 0.95, 'ambientColor': '#e6e6e2', 'saturation': 0.78, 'shafts': 0.2, 'lights': {'sun_day': 0.4}},
              }},
    'lights': [
        {'id': 'sun_day', 'from': [150, 42], 'color': '#fff2dc', 'strength': 1.0},
        {'id': 'sun_dawn', 'from': 'sky#sun', 'color': '#ffb27a', 'strength': 1.1, 'on': 'dawn'},
        {'id': 'moon', 'from': 'sky#moon', 'color': '#b4c4ec', 'strength': 1.2, 'on': 'night'},
        {'id': 'deck_lamp', 'of': 'lantern#lamp', 'reach': 9, 'strength': 1.7, 'on': 'night'},
        {'id': 'fire_light', 'across': 1.4, 'distance': 14.6, 'elevation': 1.0, 'color': '#ff8a3a', 'strength': 2.6, 'reach': 13, 'on': 'fire', 'flicker': 0.5},
        {'id': 'flare_light', 'across': 1.4, 'distance': 14.6, 'elevation': 1.6, 'color': '#ffb060', 'strength': 4, 'reach': 18, 'on': 'flare_glow'},
        {'id': 'cell_window', 'across': 400.6, 'distance': 5.6, 'elevation': 3.9, 'color': '#e8e4d8', 'strength': 1.5, 'reach': 10},
    ],
    'state': state,
    'states': states,
    'objects': objects,
    'music': {
        'scale': 'A_FLAT_MAJOR_F_MINOR', 'bpm': 84, 'density': 0.4, 'brightness': 0.55,
        'prompts': [
            {'text': 'Light orchestral travel music in the Victorian manner, a mail steamer under way, strings and woodwinds over a steady engine pulse', 'weight': 1.1},
            {'text': 'Slow marimba and low strings like a ship\'s engine, a smoke trail on the horizon, the sea going by', 'weight': 0.8},
            {'text': 'Precise pizzicato and a ticking celesta, an Englishman who never hurries, wide sea air', 'weight': 0.5},
            {'text': 'Moonlit sea at night: solo cello and harp, a tender pause at the rail, the engine far below', 'weight': 0},
            {'text': 'Oriental colour in a European orchestra, Suez in the sun, oud and clarinet over light strings', 'weight': 0},
            {'text': 'Dawn over Bombay: warm horns, tanpura drone under strings, the town rising out of the haze', 'weight': 0},
            {'text': 'Comic orchestral bounce, bassoon and pizzicato, a valet laughing at a calendar', 'weight': 0},
            {'text': 'Sea shanty on concertina and fiddle, a red-bearded captain roaring, brisk and gruff', 'weight': 0},
            {'text': 'Driving low strings and timpani, furnaces roaring, wood thrown into the fire, urgent but bright', 'weight': 0},
            {'text': 'Full sails and a broad hymn-like brass theme, a ship going slowly under canvas, generous and warm', 'weight': 0},
            {'text': 'Grey Liverpool fog: muted brass, a slow clock, the quay and the constables', 'weight': 0},
            {'text': 'Solo piano and a ticking clock in a bare cell, the light moving across the floor', 'weight': 0},
            {'text': 'Pacific sunshine: bright flutes and strings, a steamer\'s paddle wheels churning', 'weight': 0},
            {'text': 'Minimal ambient pads, wind and sea, a wide grey-green Atlantic, modern game score', 'weight': 0},
            {'text': 'Victorian travelling waltz for small orchestra, the deck in the sun, gulls', 'weight': 0},
            {'text': 'Tense pizzicato, a detective whispering to the consul, sly and quiet', 'weight': 0},
        ],
    },
}
json.dump(spec, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
