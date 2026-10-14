const beat = (name, secs) => ({ name, run: async s => { s.set('beat', name); await s.wait(secs); } });
return [
  beat('summer', 18), beat('covered', 6), beat('headlights', 14), beat('found', 20), beat('alone', 9),
  beat('back', 18), beat('rise_go', 9), beat('car', 12), beat('meet', 8), beat('ask', 9), beat('parting', 11)
];
