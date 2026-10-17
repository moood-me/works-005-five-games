
// carriage 1, its south side (Toto's carriage: his window, the door near its east end); the inside is car1_in
e.lib.carSide(g, 14.2, 1, e.state.era === 'now');
e.at(e.lib.G.WIN1 - e.lib.G.CAR1[0], -1.85, 'window');
e.at(e.lib.G.DOOR1 - e.lib.G.CAR1[0], -1.3, 'door');
