# Writes scenes/prairie/scene.json (objects, light, states) — the Prairie's spec in one place: edit here, not the JSON.
#   python tools/prairie_scene.py scenes/prairie/scene.json
# The paintings, animates, lib, script and showcase are the scene folder's files (elements/<id>.js …); the plan's
# numbers (where the line, the bridge, the station are) are lib.js `plan` — the same numbers here.
import json, sys
out = sys.argv[1]
P = 22  # the rails' middle
objs = []
def o(**k): objs.append(k); return k

# ── sky, far, land ──
o(id='sky', name='Sky', sky=True)
o(id='far', name='Far bluffs', across=0, distance=2600, box=[-5400, -190, 5400, 6])
o(id='ground', name='Snow', plane=True, across=0, distance=985, width=4000, depth=2030, drape=True)
o(id='rush', name='Snow by the line (running)', plane=True, across=0, distance=30, elevation=0.03, width=420, depth=56)
o(id='track_w', name='Line to the bridge', plane=True, across=-1146, distance=P, elevation=0.04, width=1708, depth=3.2)
o(id='track_e', name='Line', plane=True, across=864, distance=P, elevation=0.04, width=2184, depth=3.2)
o(id='poles', name='Telegraph poles', across=0, distance=27, box=[-26, -7.4, 26, 0.2],
  copies=[{'across': x, 'distance': 27} for x in range(-725, 726, 50) if not -310 < x + 25 < -212])
for i, (d, sp, x0, n) in enumerate([(46, 80, -720, 18), (95, 140, -700, 10), (170, 220, -660, 6)]):
    o(id=f'scrub{i}', name='Sagebrush under the snow', across=0, distance=d, box=[-sp, -2.6, sp, 0.2],
      copies=[{'across': x0 + k * sp, 'distance': d} for k in range(n + 1) if not (x0 + k * sp < -222 and x0 + (k + 1) * sp > -298)])

# ── the bridge at Medicine Bow: a timber trestle over the gorge, its near and far faces; the walk on its deck ──
o(id='bridge_site', name='Bridge (anchor)', unseen=True, across=-260, distance=P, elevation=30)
o(id='bridge_far', name='Bridge, far face', on='bridge_site', distance=2.0, facing=180, box=[-37, -1, 37, 31])
o(id='bridge_deck', name='Bridge deck', plane=True, unseen=True, on='bridge_site', width=64, depth=4.2, elevation=0.02, walk=True)
o(id='bridge', name='The bridge at Medicine Bow', on='bridge_site', distance=-2.0, facing=180, height=4, box=[-37, -1, 37, 31], shadow=True)
o(id='splash', name='Spray in the gorge', particles={'kind': 'splashes', 'at': [-260, P, 0.6], 'source': [16, 4, 1],
  'burst': {'on': 'bridge_splash', 'count': 220, 'over': 0.8}, 'color': '#e8eef4', 'size': [0.25, 0.6], 'speed': [4, 9]})
o(id='bridge_dust', name='Snow dust in the gorge', particles={'kind': 'puff', 'at': [-260, P, 2], 'source': [20, 6, 3],
  'burst': {'on': 'bridge_splash', 'count': 50, 'over': 1.2}, 'color': '#eef2f6', 'size': [2, 8], 'life': [3, 6]})

# ── the train: the engine and its tender, three cars — on the line (not on the land: over the gorge it stays level) ──
o(id='line', name='The line (anchor)', unseen=True, across=0, distance=P)
o(id='loco', name='Engine (anchor)', unseen=True, on='line', across=-326, place={'across': 'train_x'})
o(id='loco_far', name='Engine, far side', on='loco', distance=1.42, facing=180, box=[-0.2, -4.5, 20.8, 0.2])
o(id='cab_floor', name='Cab floor', plane=True, unseen=True, on='loco', across=8.65, elevation=1.5, width=3.0, depth=2.7)
o(id='loco_side', name='Engine', on='loco', distance=-1.42, facing=180, height=5, box=[-0.2, -5.2, 20.8, 0.2], shadow=True)
o(id='loco_front', name='Engine, front', on='loco', across=18.6, facing=90, box=[-1.7, -5.1, 1.7, 0.2])
o(id='coupling', name='Coupling', on='loco', facing=180, box=[-0.4, -1.75, 0.3, 0.1])
o(id='cars', name='Cars (anchor)', unseen=True, on='line', across=-326.6, place={'across': 'cars_x'})
o(id='cars_far', name='Cars, far side', on='cars', distance=1.42, facing=180, box=[-48.4, -4.3, 0.2, 0.2])
o(id='chain', name='Chains under the cars', on='cars', facing=180, box=[-48.4, -1.5, 1.2, 0.1])
o(id='rear_floor', name='Rear platform', plane=True, unseen=True, on='cars', across=-47.6, elevation=1.15, width=1.0, depth=2.6)
o(id='cars_side', name='Cars', on='cars', distance=-1.42, facing=180, height=4.3, box=[-48.4, -4.3, 0.2, 0.2], shadow=True)
o(id='cars_lit', name="Cars' lit windows", on='cars', distance=-1.44, facing=180, glows=True, box=[-48.4, -3.2, 0.2, -1.8])
o(id='cars_rear', name='Last car, rear end', on='cars', across=-48.1, facing=270, box=[-1.7, -4.3, 1.7, 0.2])
o(id='steam', name="Engine's smoke", particles={'kind': 'smoke', 'at': 'loco_side#chimney', 'amount': 'steam', 'rate': 10,
  'size': [0.7, 5.5], 'life': [5, 9], 'color': '#d2d4d8', 'speed': [2.5, 4], 'opacity': 0.75, 'wind': 1.2, 'shadow': 0.4})
o(id='spray', name='Snow from under the wheels', particles={'kind': 'puff', 'at': {'on': 'cars', 'at': [-24, -1.7, 0.25]}, 'source': [50, 0.6, 0.3],
  'amount': 'speed', 'rate': 70, 'color': '#f2f5f8', 'size': [0.4, 2.2], 'life': [0.6, 1.4], 'direction': [-1, 0, 0.25], 'speed': [6, 12], 'wind': 1.2})

# ── the Sioux: riders galloping along the train on its near side ──
o(id='riders', name='Sioux riders', across=0, distance=400, box=[-14, -3.6, 14, 0.3], place={'across': 'riders_x', 'distance': 'riders_d'})
o(id='riders_b', name='Sioux riders, behind', on='riders', across=9, distance=4.5, box=[-14, -3.6, 14, 0.3])
for k, at in ((1, 'riders#gun1'), (2, 'riders#gun2'), (3, 'riders_b#gun1')):
    o(id=f'shots{k}', name='Smoke of a shot', particles={'kind': 'smoke', 'at': at, 'burst': {'on': f'shots{k}', 'count': 16, 'over': 0.15},
      'color': '#ece9e2', 'size': [0.3, 1.8], 'life': [1.2, 2.4], 'speed': [1, 3], 'opacity': 0.8, 'wind': 1.4, 'drag': 1.2})
o(id='hooves', name='Snow from under the hooves', particles={'kind': 'puff', 'at': 'riders#hooves', 'source': [30, 5, 0.2], 'amount': 'riders',
  'rate': 45, 'color': '#f2f5f8', 'size': [0.5, 2.4], 'life': [0.7, 1.5], 'direction': [-1, 0, 0.3], 'speed': [3, 7], 'wind': 1.2})

# ── the station by Fort Kearney (and Omaha's, by `town`) ──
o(id='platform', name='Platform', plane=True, across=226, distance=18.4, elevation=0.5, width=60, depth=4, walk=True)
o(id='platform_edge', name='Platform edge', across=226, distance=16.4, facing=180, box=[-30.1, -0.56, 30.1, 0.05])
o(id='depot', name='Station', across=186, distance=14.5, facing=180, height=6, box=[-5.6, -6.6, 5.6, 0.1])
o(id='depot_side', name='Station, side', across=191.4, distance=14.5, facing=90, box=[-0.3, -7.2, 5.9, 0.1])
o(id='depot_roof', name='Station roof', plane=True, across=186, distance=15.8, elevation=5.3, width=11.8, depth=3.6, tilt=32)
o(id='lamp', name='Lamp on the platform', across=221.2, distance=17.0, elevation=0.5, height=3.6, box=[-0.6, -4.0, 0.6, 0.05])
o(id='tank', name='Water tank', across=166, distance=15.5, box=[-3.2, -9.6, 3.6, 0.1])
o(id='fort', name='Fort Kearney', across=150, distance=75, height=8, box=[-70, -17, 70, 1])
o(id='fort_smoke', name='Smoke over the fort and the town', particles={'kind': 'smoke', 'at': 'fort#chimney', 'source': [50, 10, 0], 'rate': 3,
  'size': [1.5, 9], 'life': [10, 16], 'color': '#c4c7cc', 'speed': [1, 1.6], 'opacity': 0.5, 'wind': 0.8, 'gravity': -0.06})
o(id='snowfall', name='Snow', particles={'kind': 'snow', 'amount': 'snowing'})

# ── Mudge's sledge under sail ──
o(id='sledge', name="Mudge's sledge (anchor)", unseen=True, across=266, distance=13.2, place={'across': 'sl_x', 'distance': 'sl_d'})
o(id='sledge_deck', name='Sledge, deck', plane=True, on='sledge', across=0.3, elevation=0.5, width=5.6, depth=2.2, walk=True)
o(id='sledge_back', name='Sledge, far side', on='sledge', distance=1.1, facing=180, box=[-2.9, -1.0, 3.8, 0.05])
o(id='sledge_side', name='Sledge', on='sledge', distance=-1.1, facing=180, height=1, box=[-2.9, -1.0, 3.8, 0.05], shadow=True)
o(id='mast', name="Sledge's mast", on='sledge', across=1.0, elevation=0.5, height=8, box=[-1.8, -8.0, 1.8, 0.05], shadow=True)
o(id='sail', name='Sail', on='sledge', across=1.0, elevation=0.5, facing=110, translucent=0.5, height=7, box=[-5.4, -7.6, 0.3, -0.4],
  place={'facing': 'sail_face'}, shadow=True)
o(id='sheet_rope', name='Sheet', on='sledge', facing=180, box=[-6, -6, 6, 1])
o(id='runner_spray', name='Snow from under the runners', particles={'kind': 'puff', 'at': {'on': 'sledge', 'at': [2.4, -1.1, 0.1]}, 'source': [0.6, 2.4, 0.1],
  'amount': 'sl_speed', 'rate': 50, 'color': '#f2f5f8', 'size': [0.3, 1.8], 'life': [0.6, 1.4], 'direction': [-1, 0, 0.4], 'speed': [3, 8], 'wind': 1.2})
o(id='ridge', name='Snow ridge', across=400, distance=11.4, box=[-5, -2.7, 5, 0.2], place={'across': 'ridge_x'})
o(id='wolves', name='Wolves', across=-400, distance=40, box=[-12, -1.4, 12, 0.2], place={'across': 'wolves_x'})
o(id='omaha_far', name="Omaha's smoke in the distance", particles={'kind': 'smoke', 'at': [2200, 2400, 0], 'source': [260, 60, 0], 'amount': 'omaha_near', 'rate': 2,
  'size': [30, 160], 'life': [30, 40], 'color': '#a3a8b0', 'speed': [4, 6], 'opacity': 0.5, 'wind': 1, 'gravity': -0.02})

# ── people ──
people = [('fogg', 'Phileas Fogg', 'fogg'), ('passepartout', 'Passepartout', 'passepartout'), ('aouda', 'Aouda', 'aouda'), ('fix', 'Fix', 'fix'),
          ('driver', 'Engine driver', 'driver'), ('captain', 'Captain of the fort', 'captain'), ('mudge', 'Mudge', 'mudge')] + \
         [(f's{i}', f'Soldier {i}', 'soldier') for i in range(1, 6)]
for pid, name, who in people:
    o(id=pid, name=name, person={'cast': 'cast', 'who': who}, across=120, distance=-60, place={'across': f'{pid}_a', 'distance': f'{pid}_d'}, shadow=True)

light = {
  'vignette': 0.28, 'grain': 0.05, 'ambient': 0.92, 'ambientColor': '#e8eefa', 'haze': 0.035, 'hazeColor': '#dfe8f4', 'hazeGlow': 0.6,
  'shafts': 0.08, 'saturation': 1.05, 'bounce': 0.6, 'wind': [1, 0.2, 0.4],
  'looks': {
    'speed': {'wind': [-1, 0, 2.6]},
    'wind_l': {'wind': [0.3, -1, 2.2]},
    'wind_r': {'wind': [0.3, 1, 2.2]},
    'snowing': {'haze': 0.32, 'hazeColor': '#e9eef4', 'ambient': 1.0, 'shafts': 0.02},
    'dawn': {'ambientColor': '#ffd6c0', 'tint': '#ff9a5a', 'tintStrength': 0.1, 'hazeColor': '#f2cdb6', 'lights': {'sun': 0}},
    'night': {'ambient': 0.62, 'ambientColor': '#7a90cc', 'haze': 0.1, 'hazeColor': '#3a4672', 'saturation': 0.82, 'hazeGlow': 1.4, 'shafts': 0.25,
              'lights': {'sun': 0, 'dawn_sun': 0}},
  },
}
lights = [
  {'id': 'sun', 'from': [-118, 15], 'color': '#fff0dc', 'strength': 1.35},
  {'id': 'dawn_sun', 'from': [72, 5], 'color': '#ffb482', 'strength': 1.2, 'on': 'dawn'},
  {'id': 'moon', 'from': 'sky#moon', 'color': '#b8c8f0', 'strength': 0.9, 'on': 'night'},
  {'id': 'platform_lamp', 'of': 'lamp#flame', 'color': '#ffa070', 'strength': 1.6, 'reach': 10, 'on': 'lamps', 'flicker': 0.12},
  {'id': 'depot_window', 'of': 'depot#window', 'color': '#ffc884', 'strength': 1.2, 'reach': 7, 'on': 'lamps'},
  {'id': 'headlamp', 'of': 'loco_side#lamp', 'color': '#ffd8a0', 'strength': 1.6, 'reach': 16, 'on': 'lamps'},
  {'id': 'car_windows', 'of': 'cars_lit#lit', 'color': '#ffcc8a', 'strength': 1.0, 'reach': 8, 'on': 'lamps'},
]
R = lambda a, b, m, smooth=True: {'range': [a, b], 'smooth': smooth, 'means': m}
B = lambda m: {'values': [0, 1], 'means': m}
N = lambda m: {'type': 'number', 'smooth': True, 'means': m}
states = {
  'night': R(0, 1, '0 — day, 1 — night: the moon, a blue light, the lamps'),
  'dawn': R(0, 1, 'dawn: a low pink sun on the right (in the east)'),
  'snowing': R(0, 1, 'snow falling and a white haze: 0 clear, 1 a blizzard'),
  'lamps': R(0, 1, "the platform's lamp, the station's window, the engine's headlamp, the cars' windows"),
  'town': {'values': ['kearney', 'omaha'], 'means': "the station: kearney — Fort Kearney's (beyond the line on the left the fort's stockade, its blockhouses, the flag); omaha — Omaha's (houses, a church, chimneys)"},
  'gate': R(0, 1, "the fort's gate: 0 shut, 1 open"),
  'train_x': N("where the engine is along the line (m; its anchor the tender's back end, the engine ahead to +20.6); the bridge −292…−228, the station's platform 196…256"),
  'cars_x': N("where the cars are along the line (m; their front end, the three cars behind it to −48.1): with the engine — train_x − 0.6; uncoupled, on their own"),
  'speed': R(0, 1, 'the train rushing «on the spot»: the line, the snow, the poles and the far bluffs run, the wheels turn, snow from under the wheels, the smoke streaming back (1 ≈ 18 m/s)'),
  'steam': R(0, 1, "the engine's smoke"),
  'shake': R(0, 1, 'the bridge trembles'),
  'bridge_down': R(0, 1, "the bridge's middle span: 0 standing (cracked), 1 fallen into the gorge"),
  'bridge_splash': {'values': [0, 1], 'means': 'the spray and the snow dust in the gorge as the span falls in (a burst as it turns 1)'},
  'riders': R(0, 1, 'the Sioux riders gallop along the train: 0 none, 1 galloping'),
  'riders_x': N('where the riders are along the line (m)'),
  'riders_d': N('how far the riders are from the viewer (m; the line at 22: they ride on its near side, 10…16)'),
  'firing': R(0, 1, 'the riders fire: puffs of smoke from their rifles now and then', False),
  'shots1': {'type': 'number', 'means': "led by the scene: a puff of smoke from the first rider's rifle as it changes"},
  'shots2': {'type': 'number', 'means': "led by the scene: a puff of smoke from the second rider's rifle"},
  'shots3': {'type': 'number', 'means': "led by the scene: a puff of smoke from a rider's rifle behind"},
  'faces': R(0, 1, "passengers' faces in the cars' windows"),
  'pp_car': R(0, 3, '«The coupling»: where Passepartout is under the cars — 0 under the middle car, 1, 2, 3 at the coupling with the tender; smoothly (hand over hand along the chains)'),
  'swing': R(0, 1, '«The coupling»: how far the cars sway (0.6)'),
  'swing_at': R(0, 1, '«The coupling»: the phase of the sway, led by the scene while Passepartout is under the cars (0.5 — the cars come together, the chains slack); the game reads it'),
  'uncouple': R(0, 1, '«The coupling»: the coupling pin — 0 in place, 1 pulled out (the engine runs on, the cars fall behind)'),
  'stop_at': R(0, 1, 'how far past the fort the cars stop (set by the game before the beat stop): 0 at the platform, 1 130 m further', False),
  'snow_on_aouda': R(0, 1, "snow settling on Aouda (her colours whiten in four steps)"),
  'fogg_went': B('Fogg went with the column: at dawn he comes out of the snow with Passepartout'),
  'fogg_on_train': B('train_leaves: 1 — Fogg on the rear platform as the train leaves; 0 — they on the platform, the train leaves without them'),
  'omaha_train': B('omaha: 1 — Passepartout makes it, Fogg gives him a hand onto the rear platform; 0 — the train leaves before he is there'),
  'sl_x': N('where the sledge is along the line (m)'),
  'sl_d': N('how far the sledge is from the viewer (m)'),
  'sail_up': R(0, 1, "the sledge's sail: 0 furled on its yard, 1 raised"),
  'sail_face': N("led by the scene (by sheet and wind): which way the sail is turned, °"),
  'sledge': R(0, 1, "«The sail»: the sledge's way to Omaha (toward the end Omaha's smoke rises over the horizon)"),
  'sl_speed': R(0, 1, "«The sail»: the sledge's speed — the snow, the line, the poles, the far bluffs run; snow from under the runners"),
  'sheet': R(0, 1, '«The sail»: the sheet — 0 let go (the sail out across the sledge), 1 hauled in (along it)'),
  'wind': R(-1, 1, "«The sail»: the wind — −1 from the sledge's left (the far side), 0 from astern, 1 from its right (the near side): the pennant on the mast, the sail to leeward"),
  'wind_l': R(0, 1, "led by the scene (by wind): the wind from the sledge's left — the far side, blowing toward the viewer"),
  'wind_r': R(0, 1, "led by the scene (by wind): the wind from the sledge's right — the near side, blowing away"),
  'drift': R(0, 1, '«The sail»: a snow ridge ahead — 0 none (or far), 1 right at the bow; falling back to 0 it passes behind'),
  'ridge_x': N('led by the scene: where the snow ridge is'),
  'ridge_h': R(0, 1, 'led by the scene: how far the snow ridge has risen out of the snow'),
  'wolves': R(0, 1, '«The sail»: wolves loping at the edge of the plain — 0 none, 1 close'),
  'wolves_x': N('led by the scene: where the wolves are'),
  'omaha_near': R(0, 1, "led by the scene: Omaha's smoke over the horizon (by sledge)"),
  'sl_fogg': B('Fogg in the sledge'), 'sl_aouda': B('Aouda in the sledge'),
  'sl_pp': B('Passepartout in the sledge'), 'sl_fix': B('Fix in the sledge'),
  'with_aouda': B('Aouda travels with them'), 'with_fix': B('Fix travels with them'),
  'fix_bruise': B("Fix's bruise round an eye"),
  'aouda_dress': B('Aouda in her travelling dress (from Hong Kong on)'),
  'beat': {'type': 'string', 'means': 'a beat of the film (the module beats; notes.md)'},
  'beat_next': {'type': 'string', 'means': 'the beat the game will set next (the module beats)'},
}
state = {
  'night': 0, 'dawn': 0, 'snowing': 0, 'lamps': 0, 'town': 'kearney', 'gate': 0,
  'train_x': -326, 'cars_x': -326.6, 'speed': 0, 'steam': 0.5, 'shake': 0, 'bridge_down': 0, 'bridge_splash': 0,
  'riders': 0, 'riders_x': 0, 'riders_d': 400, 'firing': 0, 'shots1': 0, 'shots2': 0, 'shots3': 0, 'faces': 0,
  'pp_car': 0, 'swing': 0.6, 'swing_at': 0, 'uncouple': 0, 'stop_at': 0, 'snow_on_aouda': 0, 'fogg_went': 1, 'fogg_on_train': 0, 'omaha_train': 1,
  'sl_x': 266, 'sl_d': 13.2, 'sail_up': 0, 'sail_face': 110, 'sledge': 0, 'sl_speed': 0, 'sheet': 0.6, 'wind': 0.45, 'wind_l': 0, 'wind_r': 0.45,
  'drift': 0, 'ridge_x': 400, 'ridge_h': 0, 'wolves': 0, 'wolves_x': -400, 'omaha_near': 0,
  'sl_fogg': 1, 'sl_aouda': 1, 'sl_pp': 1, 'sl_fix': 1, 'with_aouda': 0, 'with_fix': 0, 'fix_bruise': 0, 'aouda_dress': 0,
  'beat': None, 'beat_next': None, 'camera_x': -310, 'camera_z': -42,
}
for pid, _, _ in people: state[pid + '_here'] = False
music = {
  'prompts': [
    {'text': 'Wide open American West in winter: light orchestral travel music, warm horns and strings over a steady train rhythm, bright and adventurous', 'weight': 1.2},
    {'text': 'Steam train rhythm on snare brushes and low strings, pizzicato like wheels on rails, a pocket watch ticking over it', 'weight': 0.9},
    {'text': 'Crisp winter air: celesta and glockenspiel over sustained strings, snow sparkling under a huge blue sky', 'weight': 0.6},
    {'text': 'Galloping strings and low drums, riders racing alongside a running train', 'weight': 0},
    {'text': 'A creaking wooden trestle bridge over a gorge: suspense, tremolo strings, low woodwinds holding their breath', 'weight': 0},
    {'text': 'Night at a lonely prairie station: solo clarinet and soft harmonium, a lamp in falling snow, waiting', 'weight': 0},
    {'text': 'Dawn over a snowy plain, a column of soldiers coming back: gentle trumpet chorale, hopeful and warm', 'weight': 0},
    {'text': 'A sledge under sail flying over the snow: swirling flutes and strings, wind and speed, joyful and breathless', 'weight': 0},
    {'text': 'Frontier fort: a distant bugle call, a military snare, cold wind', 'weight': 0},
    {'text': 'Americana fiddle and banjo, light and quick, a small railroad town at the end of the line', 'weight': 0},
    {'text': 'Wolves at the edge of the plain: low cellos and a lonely horn, a chill in the air', 'weight': 0},
    {'text': 'Victorian comic adventure: bassoon and pizzicato, a valet who argues with an engine driver', 'weight': 0},
    {'text': 'Late romantic orchestral, sweeping and cinematic, the open prairie as far as the eye can see', 'weight': 0},
    {'text': 'Minimal ambient pads, snow falling in silence, a steam whistle far away', 'weight': 0},
    {'text': 'Driving ostinato strings and timpani, a train uncoupled at full speed, a race against time', 'weight': 0},
    {'text': 'Music box and soft strings, a woman waiting through the night, tender and patient', 'weight': 0},
    {'text': 'Brass band farewell at a station, a train pulling out, cheerful and a little sad', 'weight': 0},
  ],
  'bpm': 112, 'density': 0.5, 'brightness': 0.62, 'scale': 'A_FLAT_MAJOR_F_MINOR',
}
spec = {
  'engine': 3, 'title': 'The prairie', 'caption': 'The winter plain of the West: the railway, a bridge over a gorge, Fort Kearney.',
  'horizon': 0.6, 'camera': {'mode': 'panorama', 'span': [-440, 480]},
  'modules': ['light', 'cast', 'beats'], 'light': light, 'lights': lights,
  'relief': 'return lib.ground(across, distance);', 'state': state, 'states': states, 'objects': objs, 'music': music,
}
json.dump(spec, open(out, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(objs), 'objects')
