# writes scenes/sea/scene.json (the spec; code lives in elements/, lib.js, script.js, showcase.js):
#   python tools/sea_scene.py scenes/sea/scene.json
import json, sys
OUT = sys.argv[1]

# The «Tankadere» is built on three anchors: `boat` (in the world: her middle; its facing — the bow's yaw, its tilt —
# the pitch), `hull` (on it, turned 90°: its tilt — the heel), `frame` (on that, turned back: the boat's own frame, metres
# from her middle — across to starboard, distance forward). Everything of hers stands on `frame`; the camera rides
# `stern`. The script sets the anchors' keys from the game's (lib.pose).
ON = 'frame'
objects = [
    {'id': 'sky', 'name': 'Sky', 'sky': True},
    {'id': 'sea', 'name': 'Sea', 'plane': True, 'across': 0, 'distance': 900, 'elevation': -0.9, 'width': 6000, 'depth': 3000,
     'reflect': {'strength': 0.18, 'fade': 0, 'rough': 0.8, 'ripple': 0.6}, 'uniforms': {'phase': 0, 'storm': 0.6}},
    {'id': 'steamer', 'name': 'Steamer on the horizon', 'across': 60, 'distance': 480, 'elevation': -0.9, 'box': [-170, -270, 215, 4]},
    {'id': 'crest', 'name': 'The crest of a wave', 'across': 0, 'distance': 125, 'elevation': -1, 'box': [-70, -9, 70, 1.5],
     'place': {'across': 'crest_a', 'distance': 'crest_d', 'elevation': 'crest_e', 'facing': 'crest_f'}, 'translucent': 0.3},
    {'id': 'rain', 'name': 'Rain', 'particles': {'kind': 'rain', 'amount': 'storm', 'count': 16000, 'reach': 30}},
    # the boat
    {'id': 'boat', 'name': 'Tankadere (site)', 'unseen': True, 'across': 0, 'distance': 7.5, 'facing': 180,
     'place': {'facing': 'bow_f', 'tilt': 'pitch'}},
    {'id': 'hull', 'name': 'Tankadere, heeling (site)', 'unseen': True, 'on': 'boat', 'facing': 90, 'place': {'tilt': 'roll'}},
    {'id': 'frame', 'name': 'Tankadere (her frame)', 'unseen': True, 'on': 'hull', 'facing': 270},
    {'id': 'stern', 'name': 'Tankadere, stern (camera)', 'unseen': True, 'on': ON, 'distance': -7.2, 'facing': 180},
    {'id': 'deck', 'name': 'Deck', 'plane': True, 'on': ON, 'distance': 0.25, 'elevation': 0.0, 'width': 4.4, 'depth': 15.5, 'walk': True},
    {'id': 'side_p', 'name': 'Port bulwark', 'on': ON, 'across': -2.05, 'distance': -7.5, 'facing': 90, 'box': [-0.1, -0.8, 10.6, 0.05]},
    {'id': 'side_s', 'name': 'Starboard bulwark', 'on': ON, 'across': 2.05, 'distance': 3.0, 'facing': 270, 'box': [-0.1, -0.8, 10.6, 0.05]},
    {'id': 'bow_p', 'name': 'Port bow', 'on': ON, 'across': -2.05, 'distance': 3.0, 'facing': 111.8, 'box': [-0.1, -1.15, 5.5, 0.05]},
    {'id': 'bow_s', 'name': 'Starboard bow', 'on': ON, 'across': 0, 'distance': 8.0, 'facing': 248.2, 'box': [-0.1, -1.15, 5.5, 0.05]},
    {'id': 'bowsprit', 'name': 'Bowsprit and the gun', 'on': ON, 'distance': 7.6, 'facing': 180, 'box': [-0.9, -1.6, 0.9, 0.05]},
    {'id': 'companion', 'name': 'Companion hatch', 'on': ON, 'across': 0.2, 'distance': -2.6, 'facing': 180, 'box': [-0.8, -0.9, 0.8, 0.05]},
    {'id': 'mast_main', 'name': 'Mainmast', 'on': ON, 'distance': 0.4, 'facing': 180, 'box': [-2.3, -13.4, 2.3, 0.05]},
    {'id': 'mast_fore', 'name': 'Foremast', 'on': ON, 'distance': 4.6, 'facing': 180, 'box': [-2.3, -11.4, 2.3, 0.05]},
    # the gaff sails, their booms out to starboard: their planes run aft and out from the masts
    {'id': 'sail_main', 'name': 'Mainsail', 'on': ON, 'distance': 0.4, 'elevation': 1.9, 'facing': 245, 'box': [-0.1, -11, 7.4, 0.3], 'translucent': 0.45},
    {'id': 'sail_fore', 'name': 'Foresail', 'on': ON, 'distance': 4.6, 'elevation': 1.9, 'facing': 245, 'box': [-0.1, -9, 5.6, 0.3], 'translucent': 0.45},
    {'id': 'tiller', 'name': 'Tiller', 'plane': True, 'on': ON, 'distance': -6.4, 'elevation': 0.78, 'width': 1.2, 'depth': 2.0},
    {'id': 'rudder_head', 'name': 'Rudder head', 'on': ON, 'distance': -6.95, 'facing': 180, 'box': [-0.15, -0.85, 0.15, 0.05]},
    {'id': 'green', 'name': 'Green water over the bow', 'on': ON, 'across': -0.6, 'distance': 4.2, 'facing': 180, 'box': [-2.2, -2.6, 2.2, 0.2], 'translucent': 0.5},
    {'id': 'spray', 'name': 'Spray at the bow', 'particles': {'kind': 'splashes', 'at': {'on': ON, 'at': [0, 8.3, 0.2]}, 'amount': 'storm', 'rate': 40,
     'source': [3.5, 0.6, 0.2], 'direction': [0, -0.4, 1], 'spread': 55, 'speed': [3, 7], 'life': [0.8, 1.8], 'size': [0.15, 0.45], 'color': '#eef4f2', 'wind': 1.2}},
    {'id': 'green_splash', 'name': 'Water over the side', 'particles': {'kind': 'splashes', 'at': {'on': ON, 'at': [-1.6, 4.0, 0.7]}, 'burst': {'on': 'green_water', 'count': 260, 'over': 0.5},
     'source': [2.0, 1.5, 0.2], 'direction': [0.6, -0.5, 1], 'spread': 50, 'speed': [2, 6], 'life': [0.8, 1.6], 'size': [0.2, 0.5], 'color': '#e4eeec'}},
    {'id': 'gun_smoke', 'name': 'The gun\'s smoke', 'particles': {'kind': 'smoke', 'at': 'bowsprit#muzzle', 'burst': {'on': 'gun', 'count': 40, 'over': 0.4},
     'direction': [0, 1, 0.2], 'speed': [2, 5], 'spread': 30, 'life': [3, 6], 'size': [0.4, 3.0], 'color': ['#e8e4dc', '#a8a49c'], 'opacity': 0.8, 'wind': 1.4}},
    # points the operator frames
    {'id': 'gun_view', 'name': 'At the bow gun (to starboard of the foremast)', 'unseen': True, 'on': ON, 'across': 1.3, 'distance': 6.8, 'elevation': 1.1, 'box': [-1, -1, 1, 1]},
]
PEOPLE = [('fogg', 'Phileas Fogg', 'fogg'), ('aouda', 'Aouda', 'aouda'), ('fix', 'Fix', 'fix'), ('bunsby', 'John Bunsby', 'bunsby')]
for pid, name, who in PEOPLE:
    objects.append({'id': pid, 'name': name, 'person': {'cast': 'cast', 'who': who}, 'on': ON, 'across': 0, 'distance': -3,
                    'place': {'across': f'{pid}_a', 'distance': f'{pid}_d'}, 'shadow': True})

state = {'beat': None, 'beat_next': None, 'storm': 0, 'reef': 0, 'wave': 0, 'wave_h': 0.5, 'helm': 0, 'heel': 0, 'green_water': 0,
         'wave_from': 0, 'gun': 0, 'gun_flash': 0, 'flag': 0, 'steamer': 0, 'steamer_turn': 0, 'rock': 0, 'rise': 0,
         'bow_f': 180, 'pitch': 0, 'roll': 0, 'crest_a': 0, 'crest_d': 125, 'crest_e': -1, 'crest_f': 180,
         'with_aouda': 0, 'with_fix': 0, 'fix_bruise': 0, 'aouda_dress': 0}
for pid, _, _ in PEOPLE:
    state[f'{pid}_a'] = 0
    state[f'{pid}_d'] = -3
    state[f'{pid}_here'] = False
LED = '(led by the scene; the game is not to touch it)'
states = {
    'beat': {'type': 'string', 'means': 'the beat of the film the game plays (the module beats; notes.md lists them)'},
    'beat_next': {'type': 'string', 'means': 'the beat the game will play next (its opening made ready ahead)'},
    'storm': {'range': [0, 1], 'smooth': True, 'means': 'the typhoon: 0 — a grey squally sky, 0.6 — the storm, 1 — its height (the slate sky, the rain, the spray, the wind); 0.2 — it dies away'},
    'reef': {'range': [0, 1], 'smooth': True, 'means': 'the sails reefed: 0 — full, 1 — close-reefed (shorter from the boom up)'},
    'wave': {'range': [0, 1], 'smooth': True, 'means': "«The typhoon»: the crest's way to the bow — 0 far ahead, 0.5 under the bow (the bow lifts on it), 1 passed (the bow drops into the trough); led by the game frame by frame"},
    'wave_h': {'range': [0, 1], 'smooth': True, 'means': 'how high the waves run (the crest, the pitch)'},
    'helm': {'range': [-1, 1], 'smooth': True, 'means': 'the helm: the tiller over, the bow turned (+1 — the bow to starboard)'},
    'heel': {'range': [-1, 1], 'smooth': True, 'means': 'the heel (+1 — down to starboard, about 18°)'},
    'green_water': {'range': [0, 1], 'smooth': True, 'means': 'water over the bow: rising to 1 — a sheet of green water pouring over the port bow, a burst of spray'},
    'wave_from': {'range': [-1, 1], 'smooth': True, 'means': 'where the crest comes from: −1 the port bow, 0 dead ahead, +1 the starboard bow (its slant and its way in)'},
    'gun': {'type': 'number', 'means': 'the bow gun fired: each new number — a shot (the flash, the smoke)'},
    'gun_flash': {'range': [0, 1], 'smooth': True, 'means': "the gun's flash " + LED},
    'flag': {'values': [0, 1], 'means': 'the flag at half-mast on the mainmast (the signal of distress)'},
    'steamer': {'values': [0, 1], 'means': 'a steamer ahead to starboard, half a kilometre off, her smoke'},
    'steamer_turn': {'range': [0, 1], 'smooth': True, 'means': 'the steamer turns toward the boat: 0 — broadside, going away; 1 — bow on, coming'},
    'rock': {'range': [-1, 1], 'smooth': True, 'means': 'the swell rocking the boat ' + LED},
    'rise': {'range': [-1, 1], 'smooth': True, 'means': 'the swell lifting her bow ' + LED},
    'bow_f': {'range': [150, 210], 'smooth': True, 'means': "the boat's yaw, degrees " + LED},
    'pitch': {'range': [-25, 25], 'smooth': True, 'means': "the boat's pitch, degrees " + LED},
    'roll': {'range': [-30, 30], 'smooth': True, 'means': "the boat's heel, degrees " + LED},
    'crest_a': {'type': 'number', 'smooth': True, 'means': "the crest's place across " + LED},
    'crest_d': {'type': 'number', 'smooth': True, 'means': "the crest's place ahead " + LED},
    'crest_e': {'type': 'number', 'smooth': True, 'means': "the crest's height over the sea " + LED},
    'crest_f': {'type': 'number', 'smooth': True, 'means': "the crest's slant " + LED},
    'with_aouda': {'values': [0, 1], 'means': 'Aouda aboard (she sails to Shanghai with Fogg)'},
    'with_fix': {'values': [0, 1], 'means': 'Fix aboard (Fogg took him)'},
    'fix_bruise': {'values': [0, 1], 'means': "Fix's bruise (the cast's)"},
    'aouda_dress': {'values': [0, 1], 'means': 'Aouda in her travelling dress (from Hong Kong on)'},
}

spec = {
    'engine': 3,
    'title': 'The sea',
    'caption': 'The pilot boat Tankadere in a typhoon on the China Sea.',
    'horizon': 0.42,
    'camera': {'mode': 'walk', 'on': 'stern', 'area': [-1.5, 1.5, -0.3, 4]},
    'modules': ['light', 'cast', 'beats'],
    'light': {'vignette': 0.3, 'grain': 0.07, 'ambient': 1.0, 'ambientColor': '#eef0ee', 'haze': 0.12, 'hazeColor': '#b8c4c6', 'hazeGlow': 0.4,
              'shafts': 0.15, 'saturation': 0.95, 'wind': [0.6, -1, 0.8],
              'looks': {
                  'storm': {'ambient': 0.74, 'ambientColor': '#b8c4ca', 'haze': 0.45, 'hazeColor': '#66747a', 'saturation': 0.62, 'shafts': 0.05,
                            'wind': [0.8, -1, 3.2], 'lights': {'sun': 0.35}},
              }},
    'lights': [
        {'id': 'sun', 'from': [200, 35], 'color': '#f4f0e6', 'strength': 1.0},
        {'id': 'gun_light', 'of': 'bowsprit#muzzle', 'color': '#ffc070', 'strength': 3, 'reach': 14, 'on': 'gun_flash'},
    ],
    'state': state,
    'states': states,
    'objects': objects,
    'music': {
        'scale': 'A_FLAT_MAJOR_F_MINOR', 'bpm': 96, 'density': 0.6, 'brightness': 0.4,
        'prompts': [
            {'text': 'Stormy orchestral seascape, surging low strings and timpani rolls, a small boat in a typhoon, heroic and steady', 'weight': 1.2},
            {'text': 'Driving cellos and horns in F minor, waves rising and falling, brass swells, nineteenth-century adventure', 'weight': 0.8},
            {'text': 'A calm ticking celesta under the storm, an Englishman who does not hurry', 'weight': 0.4},
            {'text': 'Wind and rain, low drones, a boat creaking, sparse percussion', 'weight': 0},
            {'text': 'The storm dying away, a lone horn call, the sea grey and wide, hope on the horizon', 'weight': 0},
            {'text': 'A signal gun and a steamer turning, brisk strings and a bright trumpet', 'weight': 0},
            {'text': 'Sea shanty fragments on concertina against the gale, a gruff pilot', 'weight': 0},
            {'text': 'Tender solo violin in the spray, a woman calm amid the storm', 'weight': 0},
            {'text': 'Victorian adventure overture, full orchestra, waves and wind', 'weight': 0},
            {'text': 'Minimal ambient storm pads, modern game score, grey-green Pacific', 'weight': 0},
            {'text': 'Pounding taiko and low brass, the wall of a wave', 'weight': 0},
            {'text': 'Harp glissandi and flutes like spray, the boat cutting through', 'weight': 0},
            {'text': 'Bassoon and pizzicato, dry humour under the gale', 'weight': 0},
            {'text': 'Slow hymn-like brass after the typhoon, relief', 'weight': 0},
            {'text': 'Oriental colour in a European orchestra, the China Sea', 'weight': 0},
            {'text': 'Tense tremolo strings, the crest coming at the bow', 'weight': 0},
        ],
    },
}
json.dump(spec, open(OUT, 'w', encoding='utf8', newline='\n'), ensure_ascii=False, indent=1)
