export const PLAYER_KEYS = ['1','2','3','4','5','6','7','8','9','0'];

export const SHOT_TYPE_KEYS = {
  '1': { id: 'ft',  label: 'Free Throw' },
  '2': { id: '2pt', label: '2-Point' },
  '3': { id: '3pt', label: '3-Point' },
};

export const ZONE_KEYS = {
  // 3-Pointers (QWERTYU)
  'q': { id: 'right-corner',       label: 'R Corner' },
  'w': { id: 'right-wing',         label: 'R Wing' },
  'e': { id: 'right-slot',         label: 'R Slot' },
  'r': { id: 'top-key',            label: 'Top Key' },
  't': { id: 'left-slot',          label: 'L Slot' },
  'y': { id: 'left-wing',          label: 'L Wing' },
  'u': { id: 'left-corner',        label: 'L Corner' },
  // Mid-Range (ASDF)
  'a': { id: 'right-short-corner', label: 'R Short' },
  's': { id: 'right-elbow',        label: 'R Elbow' },
  'd': { id: 'left-elbow',         label: 'L Elbow' },
  'f': { id: 'left-short-corner',  label: 'L Short' },
  // Paint (ZXC)
  'z': { id: 'right-paint',        label: 'R Paint' },
  'x': { id: 'top-paint',          label: 'Top Paint' },
  'c': { id: 'left-paint',         label: 'L Paint' },
};

export const RESULT_KEYS = {
  ' ':     { id: 'made',   label: 'Made ✓' },
  'Shift': { id: 'missed', label: 'Missed ✗' },
};

export const INPUT_STEPS = ['player', 'shotType', 'zone', 'result'];

export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

export const PERIOD_OPTIONS = [
  { id: '4q', label: '4 Quarters', periods: ['Q1', 'Q2', 'Q3', 'Q4'] },
  { id: '2h', label: '2 Halves', periods: ['H1', 'H2'] },
  { id: 'ot', label: 'Overtime', periods: ['OT'] },
];
