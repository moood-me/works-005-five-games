// The Carnatic's deck about her gangway's head (seen from above): planks fore and aft, their seams caulked — where
// Passepartout falls aboard (steamer_deck#aboard); the deckhouse stands on its far end.
g.fillStyle = '#806a50';
g.fillRect(-8, -4.4, 16, 8.8);
g.fillStyle = 'rgba(28,20,12,0.35)';
for (let y = -4.25; y < 4.4; y += 0.22) g.fillRect(-8, y, 16, 0.02);
// (the planks' butts, staggered)
g.fillStyle = 'rgba(28,20,12,0.25)';
for (let y = -4.4, i = 0; y < 4.4; y += 0.22, i++) for (let x = -8 + ((i * 1.7) % 3.4); x < 8; x += 3.4) g.fillRect(x, y, 0.02, 0.22);
