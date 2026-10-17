# Writes scenes/prairie/scene.json (objects, light, states) — the spec in one place.
import json, sys
out = sys.argv[1]
P = 22  # the rails
objs = []
def o(**k): objs.append(k); return k
# ── sky, far, land ──
o(id='sky', name='Sky', sky=True)
o(id='far', name='Far rises', across=0, distance=2600, box=[-5400, -190, 5400, 6])
o(id='ground', name='Snow', plane=True, across=0, distance=435, width=1400, depth=930, drape=True)
o(id='river', name='River in the gorge', plane=True, across=-260, distance=300, elevation=0.4, width=14, depth=700, reflect={'strength': 0.45, 'fade': 0, 'rough': 0.4, 'ripple': 0.3})
o(id='rush', name='Snow by the line (running)', plane=True, across=0, distance=30, elevation=0.03, width=420, depth=56, uniforms={'phase': 0})
o(id='track_w', name='Line to the bridge', plane=True, across=-496, distance=P, elevation=0.04, width=408, depth=3.2, uniforms={'phase': 0})
o(id='track_e', name='Line', plane=True, across=236, distance=P, elevation=0.04, width=928, depth=3.2, uniforms={'phase': 0})
o(id='poles', name='Telegraph poles', across=0, distance=27, box=[-26, -7.6, 26, 0.1],
  copies=[{'across': x} for x in range(-650, 651, 50)])
for i, (d, sp, sc) in enumerate([(46, 40, 1.0), (95, 70, 1.3), (170, 110, 1.6)]):
    o(id=f'scrub{i}', name='Bushes under snow', across=0, distance=d, box=[-sp, -2.4 * sc, sp, 0.1],
      copies=[{'across': x} for x in range(-700 + (i * 17), 701, sp)])
# ── the bridge ──
o(id='bridge_site', name='Bridge (site)', unseen=True, across=-260, distance=P, elevation=30)
o(id='bridge_far', name='Bridge, far truss', on='bridge_site', distance=2.2, facing=180, box=[-36, -8, 36, 31])
o(id='bridge_deck', name='Bridge deck', plane=True, on='bridge_site', width=64, depth=4.4, elevation=0.05, walk=True)
o(id='bridge_mid', name="Middle span's deck", plane=True, on='bridge_site', width=22, depth=4.4, elevation=0.07,
  place={'elevation': 'span_drop', 'tilt': 'span_tilt'})
o(id='bridge', name='The bridge at Medicine Bow', on='bridge_site', distance=-2.2, facing=180, box=[-36, -8, 36, 31], shadow=True)
o(id='splash', name='Spray and snow in the gorge', particles={'kind': 'splashes', 'at': [-260, P, -29], 'source': [20, 4, 1],
  'burst': {'on': 'bridge_splash', 'count': 160, 'over': 0.6}, 'color': '#e8eef4', 'size': [0.3, 0.6]})
o(id='bridge_dust', name='Snow dust', particles={'kind': 'puff', 'at': [-260, P, -27], 'source': [22, 6, 2],
  'burst': {'on': 'bridge_splash', 'count': 60, 'over': 0.8}, 'color': '#eef2f6', 'size': [2, 7], 'life': [3, 6]})
# ── the train ──
o(id='loco', name='Engine (site)', unseen=True, across=-326, distance=P, place={'across': 'loco_x'})
o(id='loco_far', name='Engine, far side', on='loco', distance=1.42, facing=180, box=[-0.5, -5.6, 25.8, 0.3])
o(id='cab_floor', name='Cab floor', plane=True, on='loco', across=10.3, elevation=1.5, width=2.6, depth=2.6, walk=True)
o(id='loco_side', name='Engine', on='loco', distance=-1.42, facing=180, box=[-0.5, -6.0, 26.2, 0.3], shadow=True)
o(id='coupling', name='Coupling', on='loco', distance=-0.25, facing=180, box=[-1.2, -1.5, 0.8, 0.1])
o(id='cars', name='Cars (site)', unseen=True, across=-326.6, distance=P, place={'across': 'cars_x'})
o(id='cars_far', name='Cars, far side', on='cars', distance=1.42, facing=180, box=[-50.4, -4.5, 0.4, 0.2])
o(id='chain', name='Chains under the cars', on='cars', facing=180, box=[-50, -1.5, 1.5, 0.2])
o(id='rear_floor', name='Rear platform', plane=True, on='cars', across=-48.8, elevation=1.15, width=1.5, depth=2.6, walk=True)
o(id='cars_side', name='Cars', on='cars', distance=-1.42, facing=180, box=[-50.4, -4.6, 0.4, 0.2], shadow=True)
o(id='steam', name="Engine's smoke", particles={'kind': 'smoke', 'at': 'loco_side#chimney', 'amount': 'steam', 'rate': 9,
  'size': [0.6, 5], 'life': [5, 9], 'color': '#c9cbcf', 'speed': [2.5, 4], 'opacity': 0.75, 'wind': 1.2, 'shadow': 0.4})
o(id='spray', name='Snow from under the wheels', particles={'kind': 'puff', 'at': {'on': 'cars', 'at': [-24, -1.6, 0.3]}, 'source': [50, 0.6, 0.3],
  'amount': 'speed', 'rate': 60, 'color': '#f2f5f8', 'size': [0.4, 2.2], 'life': [0.8, 1.8], 'wind': 1.4})
# ── the riders ──
o(id='riders', name='Sioux riders', across=0, distance=50, box=[-42, -3.6, 42, 0.3], place={'across': 'riders_x', 'distance': 'riders_d'})
for k in (1, 2):
    o(id=f'shots{k}', name='Smoke of the shots', particles={'kind': 'smoke', 'at': f'riders#gun{k}', 'burst': {'on': 'shots', 'count': 14, 'over': 0.15},
      'color': '#e6e4de', 'size': [0.3, 1.8], 'life': [1.2, 2.4], 'speed': [1, 3], 'opacity': 0.8, 'wind': 1.4, 'drag': 1.2})
o(id='hooves', name='Snow from under the hooves', particles={'kind': 'puff', 'at': 'riders#hooves', 'source': [70, 3, 0.2], 'amount': 'riders',
  'rate': 40, 'color': '#f2f5f8', 'size': [0.6, 2.6], 'life': [0.8, 1.6], 'wind': 1.4})
# ── Fort Kearney's station ──
o(id='platform', name='Platform', plane=True, across=226, distance=18.4, elevation=0.5, width=60, depth=4, walk=True)
o(id='platform_edge', name='Platform edge', across=226, distance=16.4, facing=180, box=[-30.1, -0.56, 30.1, 0.05])
o(id='depot', name='Station', across=186, distance=14.5, facing=180, box=[-5.4, -6.4, 5.4, 0.1])
o(id='depot_side', name='Station, side', across=191.2, distance=14.5, facing=90, box=[-0.1, -4.4, 5.6, 0.1])
o(id='depot_roof', name='Station roof', plane=True, across=186, distance=17.25, elevation=4.3, width=11.4, depth=6.8, tilt=0)
o(id='lamp', name='Lamp on the platform', across=221.2, distance=17.0, elevation=0.5, box=[-0.6, -4.2, 0.6, 0.05])
o(id='tank', name='Water tank', across=172, distance=19.5, box=[-3, -10, 3, 0.1])
o(id='fort', name='Fort Kearney', across=225, distance=72, box=[-95, -16, 95, 1])
o(id='fort_smoke', name='Smoke over the fort and the town', particles={'kind': 'smoke', 'at': 'fort#chimney', 'source': [40, 10, 0], 'rate': 3,
  'size': [1.5, 9], 'life': [10, 16], 'color': '#bfc2c8', 'speed': [1, 1.6], 'opacity': 0.55, 'wind': 0.8, 'gravity': -0.06})
o(id='snowfall', name='Snow', particles={'kind': 'snow', 'amount': 'snowing'})
# ── the sledge ──
o(id='sledge', name="Mudge's sledge (site)", unseen=True, across=266, distance=13.2, place={'across': 'sl_x', 'distance': 'sl_d'})
o(id='sledge_deck', name='Sledge, deck', plane=True, on='sledge', elevation=0.5, width=5.4, depth=2.2, walk=True)
o(id='sledge_back', name='Sledge, far side', on='sledge', distance=1.1, facing=180, box=[-2.9, -1.0, 3.6, 0.05])
o(id='sledge_side', name='Sledge', on='sledge', distance=-1.1, facing=180, box=[-2.9, -1.0, 3.6, 0.05])
o(id='mast', name="Sledge's mast", on='sledge', across=1.0, elevation=0.5, facing=180, box=[-1.6, -8.2, 1.6, 0.05])
o(id='sail', name='Sail', on='sledge', across=1.0, elevation=0.5, facing=180, translucent=0.5, box=[-5.2, -7.6, 0.4, -0.5],
  place={'facing': 'sail_face'})
o(id='sheet_rope', name='Sheet', on='sledge', facing=180, box=[-7, -4, 7, 1])
o(id='runner_spray', name='Snow from under the runners', particles={'kind': 'puff', 'at': {'on': 'sledge', 'at': [2.6, -1.2, 0.1]}, 'source': [0.4, 2.4, 0.1],
  'amount': 'sl_speed', 'rate': 45, 'color': '#f2f5f8', 'size': [0.3, 1.8], 'life': [0.6, 1.4], 'wind': 1.2})
o(id='ridge', name='Snow ridge', across=120, distance=13.2, box=[-4.5, -2.2, 4.5, 0.1], place={'across': 'ridge_x'})
o(id='wolves', name='Wolves', across=-90, distance=33, box=[-13, -1.4, 13, 0.1], place={'across': 'wolves_x'})
o(id='omaha_far', name="Omaha's smoke in the distance", particles={'kind': 'smoke', 'at': [2200, 2400, 0], 'source': [260, 60, 0], 'amount': 'omaha_near', 'rate': 2,
  'size': [30, 160], 'life': [30, 40], 'color': '#9aa0aa', 'speed': [4, 6], 'opacity': 0.5, 'wind': 1, 'gravity': -0.02})
# ── people ──
people = [('fogg', 'Phileas Fogg', 'fogg'), ('passepartout', 'Passepartout', 'passepartout'), ('aouda', 'Aouda', 'aouda'), ('fix', 'Fix', 'fix'),
          ('driver', 'Engineer', 'driver'), ('captain', 'Captain of the fort', 'captain'), ('mudge', 'Mudge', 'mudge')] + \
         [(f's{i}', f'Soldier {i}', 'soldier') for i in range(1, 6)]
for pid, name, who in people:
    o(id=pid, name=name, person={'cast': 'cast', 'who': who}, across=120, distance=-60, place={'across': f'{pid}_a', 'distance': f'{pid}_d'}, shadow=True)

light = {
  'vignette': 0.3, 'grain': 0.06, 'ambient': 0.92, 'ambientColor': '#e8eefa', 'haze': 0.035, 'hazeColor': '#dfe8f4', 'hazeGlow': 0.6,
  'shafts': 0.08, 'saturation': 1.05, 'bounce': 0.6, 'wind': [1, 0.2, 0.4],
  'looks': {
    'speed': {'wind': [-1, 0, 2.6]},
    'wind_r': {'wind': [-1, 0.1, 2.2]},
    'wind_l': {'wind': [1, 0.1, 2.2]},
    'snowing': {'haze': 0.32, 'hazeColor': '#e9eef4', 'ambient': 1.0, 'shafts': 0.02},
    'dawn': {'ambientColor': '#ffd6c0', 'tint': '#ff9a5a', 'tintStrength': 0.1, 'hazeColor': '#f2cdb6', 'lights': {'sun': 0}},
    'night': {'ambient': 0.6, 'ambientColor': '#7086c8', 'haze': 0.1, 'hazeColor': '#34406a', 'saturation': 0.8, 'hazeGlow': 1.4, 'shafts': 0.25,
              'lights': {'sun': 0, 'dawn_sun': 0}},
  },
}
lights = [
  {'id': 'sun', 'from': [-118, 15], 'color': '#fff0dc', 'strength': 1.35},
  {'id': 'dawn_sun', 'from': [72, 5], 'color': '#ffb482', 'strength': 1.2, 'on': 'dawn'},
  {'id': 'moon', 'from': [32, 34], 'color': '#b8c8f0', 'strength': 0.9, 'on': 'night'},
  {'id': 'platform_lamp', 'of': 'lamp#flame', 'color': '#ffc27a', 'strength': 2.2, 'reach': 10, 'on': 'lamps', 'flicker': 0.12},
  {'id': 'depot_window', 'of': 'depot#window', 'color': '#ffc884', 'strength': 1.2, 'reach': 7, 'on': 'lamps'},
  {'id': 'headlamp', 'of': 'loco_side#lamp', 'color': '#ffd8a0', 'strength': 1.6, 'reach': 16, 'on': 'lamps'},
  {'id': 'car_windows', 'of': 'cars_side#lit', 'color': '#ffcc8a', 'strength': 1.0, 'reach': 8, 'on': 'lamps'},
]
R = lambda a, b, m, smooth=True: {'range': [a, b], 'smooth': smooth, 'means': m}
states = {
  'night': R(0, 1, '0 — day, 1 — night: the moon, a blue light, lamps'),
  'dawn': R(0, 1, 'dawn: a low pink sun on the right (in the east)'),
  'snowing': R(0, 1, 'snow falling and a white haze: 0 clear, 1 a blizzard'),
  'lamps': R(0, 1, "the platform's lamp, the station window, the engine's lamp, the cars' windows"),
  'town': {'values': ['kearney', 'omaha'], 'means': 'the station on the right: kearney — Fort Kearney (a stockade, a blockhouse, a flag); omaha — Omaha (houses, chimneys, smoke)'},
  'gate': R(0, 1, "the fort's gate: 0 shut, 1 open"),
  'train_x': {'type': 'number', 'smooth': True, 'means': "where the train is along the line (m; the engine's anchor — the tender's back edge; the engine ahead up to +25, the cars behind down to −50); the bridge −292…−228, the fort's platform 196…256. Leads loco_x and cars_x"},
  'loco_x': {'type': 'number', 'smooth': True, 'means': 'led by the scene: where the engine is (by train_x)'},
  'cars_x': {'type': 'number', 'smooth': True, 'means': 'led by the scene: where the cars are (by train_x while cars_free is false; in the beat stop — on their own)'},
  'cars_free': {'type': 'boolean', 'means': 'led by the scene: the cars uncoupled and rolling on their own'},
  'speed': R(0, 1, 'the train rushing «on the spot»: the line, the snow, the poles and the far view run, the wheels turn, snow from under the wheels, smoke streaming back (1 ≈ 18 m/s)'),
  'steam': R(0, 1, "led by the scene: the engine's smoke"),
  'shake': R(0, 1, 'the bridge trembles'),
  'bridge_down': R(0, 1, "the bridge's middle span: 0 standing (cracked), 1 fallen into the river"),
  'span_drop': {'type': 'number', 'smooth': True, 'means': "led by the scene (by bridge_down): how far the middle span's deck has fallen, m"},
  'span_tilt': {'type': 'number', 'smooth': True, 'means': 'led by the scene (by bridge_down): the tilt of the falling deck, °'},
  'bridge_splash': R(0, 1, 'led by the scene: a splash in the river when the span fell', False),
  'riders': R(0, 1, 'the Sioux riders gallop along the train: 0 none, 1 galloping'),
  'riders_x': {'type': 'number', 'smooth': True, 'means': 'where the riders are along the line (m)'},
  'riders_d': {'type': 'number', 'smooth': True, 'means': 'how far the riders are from the viewer (m; the line at 22)'},
  'firing': R(0, 1, 'the riders shoot: the smoke of the shots', False),
  'shots': {'type': 'number', 'means': 'led by the scene: the count of shots (each a puff of smoke)'},
  'pp_car': R(0, 3, '«The coupling»: where Passepartout is under the cars — 0 under the last, 1, 2, 3 at the coupling with the tender; smoothly (he goes hand over hand along the chains)'),
  'swing': R(0, 1, '«The coupling»: how far the cars sway (0.6 by default)'),
  'swing_at': R(0, 1, '«The coupling»: the phase of the sway 0…1, led by the scene (while Passepartout is under the cars); the game reads it'),
  'uncouple': R(0, 1, '«The coupling»: the coupling pin: 0 in place, 1 pulled out'),
  'stop_at': R(0, 1, 'how far past the fort the cars will stop (set by the game before the beat stop): 0 at the platform, 1 130 m further', False),
  'snow_on_aouda': R(0, 1, "snow on Aouda's shoulders and bonnet (her colours whiten in four steps)"),
  'fogg_went': {'values': [0, 1], 'means': 'Fogg went with the column: at dawn he comes out of the snow with Passepartout'},
  'fogg_on_train': {'values': [0, 1], 'means': 'train_leaves: 1 — Fogg on the rear platform, 0 — the train leaves without them'},
  'omaha_train': {'values': [0, 1], 'means': 'omaha: 1 — Passepartout makes it, Fogg gives him a hand from the platform; 0 — the train leaves'},
  'sl_x': {'type': 'number', 'smooth': True, 'means': 'where the sledge is along the line (m)'},
  'sl_d': {'type': 'number', 'smooth': True, 'means': 'how far the sledge is from the viewer (m)'},
  'sail_up': R(0, 1, "the sledge's sail: 0 furled, 1 raised"),
  'sail_face': {'type': 'number', 'smooth': True, 'means': 'led by the scene (by sheet and wind): which way the sail is turned, °'},
  'sledge': R(0, 1, "«The sail»: the sledge's way to Omaha (towards the end Omaha's smoke rises at the horizon)"),
  'sl_speed': R(0, 1, "«The sail»: the sledge's speed — the snow, the line, the poles, the far view run; snow from under the runners"),
  'sheet': R(0, 1, '«The sail»: the sheet — 0 let go (the sail across the sledge), 1 hauled in (along it)'),
  'wind': R(-1, 1, '«The sail»: the wind: −1 from the left, 1 from the right — the pennant on the mast, the snow and the smoke downwind, the sail goes to leeward'),
  'wind_l': R(0, 1, 'led by the scene: the wind from the left'), 'wind_r': R(0, 1, 'led by the scene: the wind from the right'),
  'drift': R(0, 1, '«The sail»: a snow ridge ahead — 0 far, 1 right at the bow'),
  'ridge_x': {'type': 'number', 'smooth': True, 'means': 'led by the scene: where the snow ridge is'},
  'wolves': R(0, 1, '«The sail»: wolves running at the edge of the plain — 0 none, 1 close'),
  'wolves_x': {'type': 'number', 'smooth': True, 'means': 'led by the scene: where the wolves are'},
  'omaha_near': R(0, 1, "led by the scene: Omaha's smoke at the horizon (by sledge)"),
  'sl_fogg': {'values': [0, 1], 'means': 'Fogg in the sledge'}, 'sl_aouda': {'values': [0, 1], 'means': 'Aouda in the sledge'},
  'sl_pp': {'values': [0, 1], 'means': 'Passepartout in the sledge'}, 'sl_fix': {'values': [0, 1], 'means': 'Fix in the sledge'},
  'with_aouda': {'values': [0, 1], 'means': 'Aouda travels with them'}, 'with_fix': {'values': [0, 1], 'means': 'Fix travels with them'},
  'fix_bruise': {'values': [0, 1], 'means': "Fix's bruise (the cast paints it, if it gives it)"},
  'aouda_dress': {'values': [0, 1], 'means': 'Aouda in a travelling dress (in America — always)'},
  'beat': {'type': 'string', 'means': 'a beat of the film (the module beats; notes.md)'},
  'beat_next': {'type': 'string', 'means': 'the beat the game will set next (the module beats)'},
}
state = {
  'night': 0, 'dawn': 0, 'snowing': 0, 'lamps': 0, 'town': 'kearney', 'gate': 0,
  'train_x': -326, 'loco_x': -326, 'cars_x': -326.6, 'cars_free': False, 'speed': 0, 'steam': 0.6, 'shake': 0, 'bridge_down': 0,
  'span_drop': 0, 'span_tilt': 0, 'bridge_splash': 0, 'riders': 0, 'riders_x': 0, 'riders_d': 400, 'firing': 0, 'shots': 0,
  'pp_car': 0, 'swing': 0.6, 'swing_at': 0, 'uncouple': 0, 'stop_at': 0, 'snow_on_aouda': 0, 'fogg_went': 1, 'fogg_on_train': 1, 'omaha_train': 1,
  'sl_x': 266, 'sl_d': 13.2, 'sail_up': 0, 'sail_face': 120, 'sledge': 0, 'sl_speed': 0, 'sheet': 0.6, 'wind': 0.4, 'wind_l': 0, 'wind_r': 0.4,
  'drift': 0, 'ridge_x': 400, 'wolves': 0, 'wolves_x': -400, 'omaha_near': 0,
  'sl_fogg': 1, 'sl_aouda': 1, 'sl_pp': 1, 'sl_fix': 1, 'with_aouda': 1, 'with_fix': 1, 'fix_bruise': 0, 'aouda_dress': 1,
  'beat': None, 'beat_next': None, 'camera_x': -308, 'camera_z': -40,
}
for pid in ['fogg','passepartout','aouda','fix','driver','captain','mudge','s1','s2','s3','s4','s5']: state[pid + '_here'] = False
# the opening picture: the train before the bridge (bridge_stop's wide), people placed by the script's film only
music = {
  'prompts': [
    {'text': 'Wide open American West in winter: light orchestral travel music, warm horns and strings over a steady train rhythm, bright and adventurous', 'weight': 1.2},
    {'text': 'Steam train rhythm on snare brushes and low strings, pizzicato like wheels on rails, a pocket watch ticking over it', 'weight': 0.9},
    {'text': 'Crisp winter air: celesta and glockenspiel over sustained strings, snow sparkling under a huge blue sky', 'weight': 0.6},
    {'text': 'Tense galloping strings and tom-toms, riders racing alongside a running train, gunshots far off', 'weight': 0},
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
