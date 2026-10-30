# The beds' recordings

Real recordings from Freesound, CC0 licence (no conditions): a piece of ~45 s cut from each, looped (the last 2.5 s mixed
into the start), the loudness brought to −24 dBFS RMS, MP3 96 kbit/s. Chosen by Pavel 2026-10-16
(rpg docs/history/2026-10-16-game-sounds.md); `sound.js` fits each to the loudness of the bed before it.

| File | Recording | Author |
|---|---|---|
| `crowd-550916.mp3` | [BGSaSc Walla Medium Crowd German Berlin Talking People 01](https://freesound.org/people/Profispiesser/sounds/550916/) | Profispiesser |
| `hall-735472.mp3` | [Large Crowd before a chior concert 2](https://freesound.org/people/pluralz/sounds/735472/) | pluralz |
| `hall-850562.mp3` | [Walla Teatro](https://freesound.org/people/Mariayolanda511/sounds/850562/) | Mariayolanda511 |
| `sea-shore-240645.mp3` | [Ocean Lake Sea Shore Waves.wav](https://freesound.org/people/GLM_KG/sounds/240645/) | GLM_KG |
| `sea-shore-517945.mp3` | [Ocean gentle waves on beach fizzing bubbles.wav](https://freesound.org/people/jackmichaelking/sounds/517945/) | jackmichaelking |
| `steam-473904.mp3` | [Steam train leaving the station.m4a](https://freesound.org/people/cauby43/sounds/473904/) | cauby43 |
| `weep-171947.mp3` | [WomanSadMoan.wav](https://freesound.org/people/RebekahDay/sounds/171947/) | RebekahDay |
| `weep-172738.mp3` | [crying woman.wav](https://freesound.org/people/AlucardsBride/sounds/172738/) | AlucardsBride |

## Added 2026-10-30 (real recordings for places and things)

All Freesound recordings are CC0. Beds: ~45 s cut, looped (last 2.5 s mixed into the start), −24 dBFS RMS (spiky ones
quieter: the peaks are held to 3 dB into the limiter), MP3 96 kbit/s mono; `snow` high-passed at 120 Hz and `thaw` at
150 Hz (the rumble of the microphone and the city, not the snow). One-offs: trimmed tight, peak −1 dBFS, MP3 96 kbit/s
mono; the sharp short ones (`gate`, `door`, `paper`, `knife`, `clink`, `spill`, `watch`) evened with a compressor and a
limiter. Music: mono 96 kbit/s, about −22 dBFS RMS. Measured with ffmpeg: beds and music — integrated LUFS (ebur128),
one-offs — RMS of the loudest 0.4 s (dBFS).

| File | Recording | Author | Measure |
|---|---|---|---|
| `cicadas.mp3` | [Day Crickets & Cicadas 4](https://freesound.org/people/simous00/sounds/852877/) (Crete, June) | simous00 | −21.1 LUFS |
| `crickets.mp3` | [20240816_Crickets_in_the_Night_002](https://freesound.org/people/Borgory/sounds/751472/) | Borgory | −21.3 LUFS |
| `wind.mp3` | [Autumn wind Bergen Nordnes.wav](https://freesound.org/people/frodeims/sounds/596454/) (sea, trees) | frodeims | −25.3 LUFS |
| `snow.mp3` | [Snowfall Ambience, City](https://freesound.org/people/Kinoton/sounds/719961/) | Kinoton | −23.8 LUFS |
| `thaw.mp3` | [Dripping melting snow late winter outside roof](https://freesound.org/people/TRP/sounds/717841/) | TRP | −30.2 LUFS |
| `bark.mp3` | [Pomeranian Small Dog Barking.mp3](https://freesound.org/people/yunjish/sounds/608732/) (three barks) | yunjish | −17.7 dBFS |
| `yap.mp3` | [Little Dog Barking.wav](https://freesound.org/people/johnnydekk/sounds/615307/) | johnnydekk | −15.2 dBFS |
| `growl.mp3` | [Dog Shih Tzu Growling 03.wav](https://freesound.org/people/Glitchedtones/sounds/372537/) | Glitchedtones | −13.8 dBFS |
| `sleigh.mp3` | [Sleighbells II.wav](https://freesound.org/people/Fenodyrie/sounds/583952/) (faded in 2.5 s and out 3 s to pass by) | Fenodyrie | −17.7 dBFS |
| `gate.mp3` | [gate_OpenClose.wav](https://freesound.org/people/quality83/sounds/546160/) (the creak and the latch, the silence between cut out) | quality83 | −22.1 dBFS |
| `door.mp3` | [Door close Dave (1).wav](https://freesound.org/people/Dave_Gibson/sounds/586840/) | Dave_Gibson | −13.8 dBFS |
| `tuning.mp3` | [Orchestra Tuning.wav](https://freesound.org/people/tyujik/sounds/232260/) (Bolshoi Theatre, Moscow) | tyujik | −12.8 dBFS |
| `bell.mp3` | [triple bell.mp3](https://freesound.org/people/florianreichelt/sounds/563016/) (a ship's bell, three strokes) | florianreichelt | −11.8 dBFS |
| `bell_theatre.mp3` | [Bell ringing thrice.wav](https://freesound.org/people/Fenodyrie/sounds/583948/) | Fenodyrie | −12.9 dBFS |
| `whistle.mp3` | [Steam Whistle.mp3](https://freesound.org/people/Bidone/sounds/71778/) | Bidone | −9.5 dBFS |
| `wheels.mp3` | [S24-05 Steam engine train starts and pulls away.wav](https://freesound.org/people/craigsmith/sounds/675309/) (old film-library copy; the engine's strokes speeding up, not joints of rails) | craigsmith | −11.8 dBFS |
| `horn.mp3` | [Long Steamboat Whistle](https://freesound.org/people/Robo9418/sounds/840325/) | Robo9418 | −10.7 dBFS |
| `pour.mp3` | [herbata.wav](https://freesound.org/people/laffik/sounds/609899/) | laffik | −19.8 dBFS |
| `spill.mp3` | [Small Water Spill](https://freesound.org/people/Braleven/sounds/319418/) + [Drips](https://freesound.org/people/DinoKid/sounds/863012/) | Braleven, DinoKid | −22.3 dBFS |
| `paper.mp3` | [Paper drawn with rustle](https://freesound.org/people/Mafon2/sounds/360646/) (an envelope unfolded) | Mafon2 | −19.3 dBFS |
| `watch.mp3` | click: [Putting On and Taking Off a Watch.wav](https://freesound.org/people/ross_sinc/sounds/444797/) (a clasp, standing for the lid); ticking: [pocket watch.wav](https://freesound.org/people/NistuGgner/sounds/706551/) | ross_sinc, NistuGgner | −24.7 dBFS |
| `knife.mp3` | [Watermelon Slicing 2.m4a](https://freesound.org/people/Yin_Yang_Jake007/sounds/443467/) | Yin_Yang_Jake007 | −22.0 dBFS |
| `clink.mp3` | [dropped my glasses](https://freesound.org/people/clothespeg/sounds/621901/) | clothespeg | −17.6 dBFS |
| `scales.mp3` | [Anthony Williams - Week 1 - Daily Piano Exercize (C major scale)](https://freesound.org/people/CreativeMusicalCoding/sounds/754077/) | CreativeMusicalCoding | −22.1 LUFS |
| `hanon.mp3` | [piano3_ex4_good_bad.wav](https://freesound.org/people/sarafg11/sounds/522879/) (Hanon, The Virtuoso Pianist, exercise 4) | sarafg11 | −21.0 LUFS |
| `waltz.mp3` | [Ion Ivanovici - Waves of the Danube (Zonophone, 1914)](https://commons.wikimedia.org/wiki/File:Ion_Ivanovici_-_Waves_of_the_Danube_(Zonophone,_1914).oga) — wind orchestra of the Zonophone society, from the Russian State Archive of Sound Recordings (RGAFD); Public Domain Mark on Commons: the waltz (1880, composer d. 1902) and a 1914 recording, which is public domain in the US too (sound recordings before 1923). | Zonophone Record, 1914 | −22.8 LUFS |

For comparison, the first eight files measured the same way: `crowd-550916` −22.3, `hall-735472` −21.4, `hall-850562` −21.7,
`sea-shore-240645` −20.5, `sea-shore-517945` −20.7, `steam-473904` −21.0, `weep-171947` −18.9, `weep-172738` −19.2 LUFS
(the two weeps' loudest 0.4 s: −11.7 and −15.1 dBFS).
