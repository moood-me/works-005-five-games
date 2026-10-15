# writes scenes/paluba/scene.json (the spec; code lives in elements/, lib.js, script.js, showcase.js)
import json, sys
OUT = sys.argv[1]
PARTS = ['deckhouse', 'boats', 'bunks', 'yards', 'mast_fore', 'mast_main', 'bulwarks', 'speedy_cabin']
PART_RU = {'deckhouse': 'рубка', 'boats': 'шлюпки', 'bunks': 'койки (штабель у люка)', 'yards': 'реи', 'mast_fore': 'фок-мачта',
           'mast_main': 'грот-мачта', 'bulwarks': 'фальшборт', 'speedy_cabin': 'каюта капитана'}
HOME = {'deckhouse': [0, 18], 'boats': [-2.6, 15.8], 'bunks': [3.4, 12.4], 'yards': [0, 11], 'mast_fore': [0, 34], 'mast_main': [0, 11],
        'bulwarks': [0, 0], 'speedy_cabin': [-3, 7]}
PEOPLE = [('fogg', 'Филеас Фогг', 'fogg'), ('passepartout', 'Паспарту', 'passepartout'), ('aouda', 'Ауда', 'aouda'), ('fix', 'Фикс', 'fix'),
          ('consul', 'Консул', 'consul'), ('sailor', 'Матрос', 'sailor'), ('speedy', 'Капитан Спиди', 'speedy'), ('stoker', 'Кочегар', 'stoker'),
          ('policeman', 'Констебль', 'policeman'), ('policeman_2', 'Констебль', 'policeman')]

def part_place(p):
    return {'across': f'at_{p}_a', 'distance': f'at_{p}_d', 'elevation': f'at_{p}_e'}

objects = [
    {'id': 'sky', 'name': 'Небо', 'sky': True},
    {'id': 'sea', 'name': 'Море', 'plane': True, 'across': 0, 'distance': 600, 'elevation': -5.5, 'width': 6000, 'depth': 4000,
     'reflect': {'strength': 0.5, 'fade': 0, 'rough': 0.55, 'ripple': 0.35}, 'uniforms': {'phase': 0, 'caps': 0.5}},
    {'id': 'port_far', 'name': 'Порт на горизонте', 'across': 560, 'distance': 1500, 'elevation': -5.5, 'box': [-1100, -130, 1100, 2]},
    {'id': 'china', 'name': 'Дым «Китая» на горизонте', 'across': -260, 'distance': 2200, 'elevation': -5.5, 'box': [-60, -150, 260, 2]},
    {'id': 'quay', 'name': 'Причал', 'plane': True, 'across': 30, 'distance': 30, 'elevation': -2.6, 'width': 48, 'depth': 160},
    {'id': 'sheds', 'name': 'Пакгаузы на причале', 'across': 42, 'distance': 110, 'elevation': -2.6, 'facing': 270, 'box': [0, -30, 150, 0.2]},
    {'id': 'gangway', 'name': 'Сходни', 'plane': True, 'across': 7.35, 'distance': 9.7, 'elevation': -1.3, 'width': 1.1, 'depth': 4.69,
     'rotation': 270, 'tilt': 33.7, 'walk': True},
    {'id': 'deck', 'name': 'Палуба', 'plane': True, 'across': 0, 'distance': 22, 'elevation': 0.005, 'width': 11.2, 'depth': 54},
    # the bulwarks: an anchor the burn moves; the port side's (the part's point) and the starboard's on it
    {'id': 'bulwarks_at', 'name': 'Фальшборт (место)', 'unseen': True, 'across': 0, 'distance': 0, 'place': part_place('bulwarks')},
    {'id': 'bulwarks', 'name': 'Фальшборт левого борта', 'on': 'bulwarks_at', 'across': -5.45, 'distance': -5, 'facing': 90, 'box': [-0.2, -1.25, 52.2, 0.1]},
    {'id': 'bulwarks_s', 'name': 'Фальшборт правого борта', 'on': 'bulwarks_at', 'across': 5.45, 'distance': 47, 'facing': 270, 'box': [-0.2, -1.25, 52.2, 0.1]},
    # what stays when the bulwarks burn: the iron sheer strake and stanchions
    {'id': 'gunwale', 'name': 'Железный борт, левый', 'across': -5.5, 'distance': -5, 'facing': 90, 'box': [-0.2, -0.5, 52.2, 0.1]},
    {'id': 'gunwale_s', 'name': 'Железный борт, правый', 'across': 5.5, 'distance': 47, 'facing': 270, 'box': [-0.2, -0.5, 52.2, 0.1]},
    {'id': 'bow', 'name': 'Нос', 'across': 0, 'distance': 47.2, 'box': [-6, -6, 6, 0.2]},
    {'id': 'spray', 'name': 'Брызги у форштевня', 'particles': {'kind': 'splashes', 'at': [0, 50, -4.8], 'amount': 'speed', 'rate': 26,
     'source': [3.2, 1, 0.2], 'direction': [0, 0, 1], 'spread': 50, 'speed': [2, 4.5], 'life': [0.8, 1.6], 'size': [0.18, 0.4], 'color': '#eef4f4'}},
    # the captain's cabin (the «Henrietta»; the others' after skylight)
    {'id': 'cabin', 'name': 'Каюта капитана (место)', 'unseen': True, 'across': -3, 'distance': 7, 'place': part_place('speedy_cabin')},
    {'id': 'speedy_cabin', 'name': 'Каюта капитана', 'on': 'cabin', 'facing': 180, 'box': [-1.55, -2.6, 1.55, 0.1]},
    {'id': 'speedy_cabin_side', 'name': 'Каюта капитана, бок', 'on': 'cabin', 'across': 1.5, 'facing': 90, 'box': [-0.1, -2.6, 3.7, 0.1]},
    {'id': 'cabin_roof', 'name': 'Крыша каюты', 'plane': True, 'on': 'cabin', 'distance': 1.8, 'elevation': 2.3, 'width': 3.1, 'depth': 3.7, 'walk': True},
    # the deckhouse, its bridge on the roof, the calendar on its aft face
    {'id': 'house', 'name': 'Рубка (место)', 'unseen': True, 'across': 0, 'distance': 18, 'place': part_place('deckhouse')},
    {'id': 'deckhouse', 'name': 'Рубка', 'on': 'house', 'facing': 180, 'box': [-2.3, -2.6, 2.3, 0.1]},
    {'id': 'deckhouse_side', 'name': 'Рубка, правый бок', 'on': 'house', 'across': 2.2, 'facing': 90, 'box': [-0.1, -2.6, 8.1, 0.1]},
    {'id': 'house_roof', 'name': 'Мостик на рубке', 'plane': True, 'on': 'house', 'distance': 4, 'elevation': 2.4, 'width': 4.6, 'depth': 8.2, 'walk': True},
    {'id': 'bridge_rail', 'name': 'Поручни мостика', 'on': 'house', 'distance': 0.15, 'elevation': 2.4, 'facing': 180, 'box': [-2.5, -1.3, 2.5, 0.05]},
    {'id': 'calendar', 'name': 'Календарь на рубке', 'on': 'house', 'across': -1.2, 'distance': -0.04, 'elevation': 1.62, 'facing': 180, 'box': [-0.32, -0.44, 0.32, 0.04]},
    {'id': 'funnel', 'name': 'Труба', 'across': 0, 'distance': 22.5, 'box': [-1.4, -11.4, 1.4, 0.1]},
    {'id': 'smoke_p', 'name': 'Дым из трубы', 'particles': {'kind': 'smoke', 'at': 'funnel#top', 'amount': 'smoke', 'rate': 4, 'life': [14, 22],
     'source': [0.9, 0.9, 0], 'speed': [2.2, 3.2], 'spread': 14, 'gravity': -0.15, 'drag': 0.3, 'wind': 1.4, 'size': [1.6, 9], 'color': ['#5a5652', '#9a9690'],
     'opacity': 0.75, 'shadow': 0.4}},
    {'id': 'sparks_p', 'name': 'Искры из трубы', 'particles': {'kind': 'sparks', 'at': 'funnel#top', 'amount': 'fire', 'rate': 30, 'speed': [3, 7], 'spread': 30, 'direction': [0, 0, 1], 'wind': 1}},
    {'id': 'mast_main', 'name': 'Грот-мачта', 'across': 0, 'distance': 11, 'box': [-5.8, -25.6, 5.8, 0.2], 'place': part_place('mast_main')},
    {'id': 'mast_fore', 'name': 'Фок-мачта', 'across': 0, 'distance': 34, 'box': [-5.8, -23.6, 5.8, 0.2], 'place': part_place('mast_fore')},
    {'id': 'yards_at', 'name': 'Реи (место)', 'unseen': True, 'across': 0, 'distance': 11, 'place': part_place('yards')},
    {'id': 'yards', 'name': 'Реи и паруса грот-мачты', 'on': 'yards_at', 'box': [-8, -24.6, 8, -5], 'translucent': 0.4},
    {'id': 'yards_fore', 'name': 'Реи и паруса фок-мачты', 'on': 'yards_at', 'distance': 23, 'box': [-8, -22.6, 8, -5], 'translucent': 0.4},
    {'id': 'hatch', 'name': 'Люк кочегарки', 'across': 1.4, 'distance': 13.8, 'box': [-1.0, -0.75, 1.0, 0.05]},
    {'id': 'hatch_glow', 'name': 'Огонь в люке', 'plane': True, 'across': 1.4, 'distance': 14.6, 'elevation': 0.66, 'width': 1.5, 'depth': 1.5, 'glows': True},
    {'id': 'hatch_fire', 'name': 'Пламя из люка', 'particles': {'kind': 'fire', 'at': 'hatch#fire', 'amount': 'fire', 'size': [0.7, 0.15], 'source': [1.1, 1.1, 0], 'rate': 40}},
    {'id': 'flare_p', 'name': 'Вспышка в люке', 'particles': {'kind': 'sparks', 'at': 'hatch#fire', 'burst': {'on': 'flare', 'count': 160, 'over': 0.4},
     'speed': [3, 8], 'spread': 40, 'direction': [0, 0, 1]}},
    {'id': 'bunks', 'name': 'Койки', 'across': 3.4, 'distance': 12.4, 'box': [-1.2, -1.6, 1.2, 0.1], 'place': part_place('bunks')},
    {'id': 'boats', 'name': 'Шлюпки', 'across': -2.6, 'distance': 15.8, 'box': [-2.8, -1.9, 2.8, 0.1], 'place': part_place('boats')},
    {'id': 'paddle_box', 'name': 'Кожух колеса', 'across': 5.45, 'distance': 20, 'facing': 270, 'box': [-5.6, -5.2, 5.6, 0.1]},
    {'id': 'walking_beam', 'name': 'Балансир машины', 'across': 0, 'distance': 15.2, 'box': [-4.6, -10, 4.6, 0.1]},
    {'id': 'lantern', 'name': 'Фонарь у борта', 'across': 4.75, 'distance': 11.3, 'box': [-0.5, -3, 0.5, 0.1]},
    {'id': 'deckchair', 'name': 'Шезлонг', 'across': -2.6, 'distance': 13.2, 'facing': 210, 'box': [-0.5, -1.0, 0.5, 0.1]},
    # points the operator frames: between the people of a moment
    {'id': 'night_two', 'name': 'Двое у борта', 'unseen': True, 'across': 4.55, 'distance': 9.6, 'elevation': 1.45},
    {'id': 'fix_consul', 'name': 'Фикс и консул', 'unseen': True, 'across': 3.9, 'distance': 12.3, 'elevation': 1.5},
    {'id': 'two_pacific', 'name': 'Паспарту и Фикс', 'unseen': True, 'across': 4.2, 'distance': 9.65, 'elevation': 1.45},
    {'id': 'calendar_three', 'name': 'У календаря', 'unseen': True, 'across': -0.6, 'distance': 15.8, 'elevation': 1.4},
    {'id': 'coal_three', 'name': 'У люка', 'unseen': True, 'across': 0.9, 'distance': 12.2, 'elevation': 1.4},
    {'id': 'bridge_two', 'name': 'На мостике', 'unseen': True, 'across': 0.1, 'distance': 18.9, 'elevation': 3.9},
    # inserts
    {'id': 'porthole', 'name': 'Спиди в иллюминаторе', 'insert': 'porthole', 'iris': [0.889, 0.5, 0.46, 0.46]},
    {'id': 'cell_close', 'name': 'Скамья в камере', 'insert': 'cell_close'},
    # the custom house's cell, far off to starboard
    {'id': 'cell', 'name': 'Камера (место)', 'unseen': True, 'across': 400, 'distance': 0},
    {'id': 'cell_floor', 'name': 'Пол камеры', 'plane': True, 'on': 'cell', 'distance': 3, 'elevation': 0.01, 'width': 7.2, 'depth': 6.4, 'inside': True},
    {'id': 'cell_back', 'name': 'Стена камеры с окном', 'on': 'cell', 'distance': 6, 'facing': 180, 'box': [-3.7, -5.4, 3.7, 0.1], 'inside': True},
    {'id': 'cell_left', 'name': 'Стена камеры с дверью', 'on': 'cell', 'across': -3.5, 'distance': -0.6, 'facing': 90, 'box': [-0.1, -5.4, 6.8, 0.1], 'inside': True},
    {'id': 'cell_right', 'name': 'Стена камеры', 'on': 'cell', 'across': 3.5, 'distance': 6.2, 'facing': 270, 'box': [-0.1, -5.4, 6.8, 0.1], 'inside': True},
    {'id': 'cell_bench', 'name': 'Скамья', 'on': 'cell', 'across': -0.2, 'distance': 5.05, 'facing': 180, 'box': [-1.3, -0.6, 1.3, 0.05], 'inside': True},
]
for pid, ru, who in PEOPLE:
    objects.append({'id': pid, 'name': ru, 'person': {'cast': 'cast', 'who': who}, 'across': -2, 'distance': -3,
                    'place': {'across': f'{pid}_a', 'distance': f'{pid}_d'}, 'shadow': True})

state = {'beat': None, 'ship': 'mongolia', 'port': 'suez', 'night': 0, 'dawn': 0, 'fog': 0, 'smoke': 1, 'speed': 0, 'sails': 0,
         'fire': 0, 'flare': 0, 'flare_glow': 0, 'speedy_grief': 0, 'porthole': 0, 'cell_close': 0, 'cell_time': 0, 'release': None,
         'door': 0, 'leaf': 0, 'with_aouda': 1, 'with_pp': 1, 'with_fix': 1, 'fix_bruise': 0, 'pp_wings': 0, 'aouda_dress': 0}
states = {
    'ship': {'values': ['mongolia', 'rangoon', 'general_grant', 'henrietta'], 'means': 'корабль: mongolia — P&O, чёрная труба, белый фальшборт, тиковая рубка; rangoon — тот же вид (ночь — ключ night); general_grant — американский колёсный: белая рубка, красная труба, кожух колеса у борта, балансир машины; henrietta — железный винтовой с двумя мачтами и реями, деревянные рубка, фальшборт, каюта капитана на юте (части горят — «Котлы»). Меняется склейкой'},
    'port': {'values': ['suez', 'bombay', 'new_york', 'queenstown', 'liverpool', 'none'], 'means': 'порт на горизонте справа по носу: suez — минареты, пальмы, мол, причал и сходни у борта; bombay — город и холмы (на рассвете); new_york — набережная, причал и сходни; queenstown — зелёные холмы Ирландии; liverpool — доки, краны, кирпич, причал и сходни; none — открытое море'},
    'night': {'range': [0, 1], 'smooth': True, 'means': 'ночь: луна справа, лунная дорожка, фонарь у борта горит'},
    'dawn': {'range': [0, 1], 'smooth': True, 'means': 'рассвет: низкое солнце справа по носу, розовое небо'},
    'fog': {'range': [0, 1], 'smooth': True, 'means': 'туман (Ливерпуль)'},
    'smoke': {'range': [0, 1], 'smooth': True, 'means': 'сколько дымит труба: 1 — под парами, 0.2 — угля нет, 0 — потушены'},
    'speed': {'range': [0, 1], 'smooth': True, 'means': 'ход: бег воды мимо борта, барашки, брызги у носа (0 — стоит)'},
    'sails': {'range': [0, 1], 'smooth': True, 'means': '«Генриетта»: паруса на реях, 0 — убраны, 1 — все поставлены'},
    'fire': {'range': [0, 1], 'smooth': True, 'means': 'огонь в топке: пламя из люка кочегарки, его свет, искры из трубы («Котлы»)'},
    'flare': {'type': 'number', 'means': 'вспышка в люке: каждый новый номер — сноп искр (ставит сцена, когда часть уходит в люк; игра может и сама)'},
    'flare_glow': {'range': [0, 1], 'smooth': True, 'means': 'свет вспышки в люке (ведёт сцена вместе с flare)'},
    'speedy_grief': {'range': [0, 1], 'smooth': True, 'means': 'Спиди хватается за голову: от 0.4 — руки к голове, лицо злое; от 0.8 — горе'},
    'porthole': {'range': [0, 1], 'smooth': True, 'means': 'вставка: Спиди в иллюминаторе каюты крупно, рыжая борода, ревёт (0 — закрыта)'},
    'cell_close': {'range': [0, 1], 'smooth': True, 'means': 'вставка: скамья таможенной камеры, часы Фогга открыты на ней, его руки на коленях (0 — закрыта)'},
    'cell_time': {'range': [0, 1], 'smooth': True, 'means': 'тень решётки ползёт по полу и скамье: 0 — утро, 1 — через три часа (ведёт игра)'},
    'release': {'values': [None, 'down', 'hand'], 'means': 'чем кончается кусок release, если поставлен до него: down — Фогг бьёт, Фикс падает; hand — рука в руке; null — кусок кончается на release:in'},
    'door': {'range': [0, 1], 'smooth': True, 'means': 'дверь камеры: 0 — заперта, 1 — распахнута'},
    'leaf': {'range': [0, 1], 'smooth': True, 'means': 'лист календаря на рубке: 0 — «Среда», 1 — перевёрнут, под ним опять «Среда»'},
    'with_aouda': {'values': [0, 1], 'means': 'Ауда в пути (Нью-Йорк, Ливерпуль)'},
    'with_pp': {'values': [0, 1], 'means': 'Паспарту в пути (Нью-Йорк, «Котлы», Ливерпуль)'},
    'with_fix': {'values': [0, 1], 'means': 'Фикс в пути (Нью-Йорк)'},
    'fix_bruise': {'values': [0, 1], 'means': 'синяк Фикса (как его даёт каст)'},
    'pp_wings': {'values': [0, 1], 'means': 'Паспарту в крыльях «Длинных носов» (как их даёт каст)'},
    'aouda_dress': {'values': [0, 1], 'means': 'Ауда в дорожном платье (с Гонконга)'},
}
for p in PARTS:
    states[p] = {'values': [0, 1], 'means': f'«Генриетта», {PART_RU[p]}: 1 — на месте, 0 — сгорела (ушла в люк со вспышкой)'}
    states[f'drag_{p}'] = {'range': [0, 1], 'smooth': True, 'means': f'{PART_RU[p]}: 0 — на месте, 1 — дотащена к люку (уменьшается по пути; мачта сначала валится)'}
    states[f'locked_{p}'] = {'values': [0, 1], 'means': f'{PART_RU[p]}: 1 — не по деньгам (тусклее, как не своя)'}
    for k in 'ade':
        states[f'at_{p}_{k}'] = {'type': 'number', 'smooth': True, 'means': f'где {PART_RU[p]} (ведёт сцена по drag_{p}; игре не трогать)'}
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
    'title': 'Палуба',
    'caption': 'Палуба парохода у борта: море, дым из трубы, порт на горизонте.',
    'horizon': 0.45,
    'camera': {'mode': 'walk', 'area': [-5, 5, -6, 30]},
    'modules': ['svet', 'cast', 'beats'],
    'relief': "return across > 5.7 ? -2.6 : across < -5.7 ? -5.5 : 0;",
    'light': {'vignette': 0.35, 'grain': 0.06, 'ambient': 1.0, 'ambientColor': '#f2f0ea', 'haze': 0.05, 'hazeColor': '#d2dee4', 'hazeGlow': 0.7,
              'shafts': 0.1, 'saturation': 1.0, 'wind': [-0.25, -1, 0.9], 'inside': 0.55,
              'looks': {
                  'dawn': {'ambient': 0.85, 'ambientColor': '#f2cdb8', 'tint': '#ff9a70', 'tintStrength': 0.12, 'haze': 0.1, 'hazeColor': '#ecc0a6', 'shafts': 0.35, 'lights': {'sun_day': 0.15}},
                  'night': {'ambient': 0.55, 'ambientColor': '#6a7cb4', 'haze': 0.08, 'hazeColor': '#1e2a46', 'saturation': 0.82, 'shafts': 0.45, 'lights': {'sun_day': 0, 'sun_dawn': 0}},
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
