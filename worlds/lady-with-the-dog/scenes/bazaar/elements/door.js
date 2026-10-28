// The door's leaf, hinged on its left (metres from the hinge, x to the right): dark polished wood, two panels, a brass
// handle. `door` turns it open into the room. Its point: the door (an offer in “Taking counsel”).
g.fillStyle = '#4a3326'; g.fillRect(0, -2.35, 0.9, 2.35);
g.strokeStyle = '#2f2018'; g.lineWidth = 0.03;
g.strokeRect(0.1, -2.2, 0.7, 1.0); g.strokeRect(0.1, -1.05, 0.7, 0.9);
g.fillStyle = '#c9a45e'; g.beginPath(); g.arc(0.78, -1.1, 0.03, 0, Math.PI * 2); g.fill();
e.at(0.45, -1.2, 'door');
