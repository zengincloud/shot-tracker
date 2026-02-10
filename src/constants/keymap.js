export const PLAYER_KEYS = ['1','2','3','4','5','6','7','8','9','0'];

export const SHOT_TYPE_KEYS = {
  'a': { id: '2pt', label: '2-Point' },
  's': { id: '3pt', label: '3-Point' },
  'd': { id: 'ft',  label: 'Free Throw' },
};

export const ZONE_KEYS = {
  'z': { id: 'left-corner',        label: 'L Corner' },
  'x': { id: 'left-wing',          label: 'L Wing' },
  'q': { id: 'left-slot',          label: 'L Slot' },
  'c': { id: 'top-key',            label: 'Top Key' },
  'w': { id: 'right-slot',         label: 'R Slot' },
  'v': { id: 'right-wing',         label: 'R Wing' },
  'b': { id: 'right-corner',       label: 'R Corner' },
  'e': { id: 'left-short-corner',  label: 'L Short' },
  'r': { id: 'right-short-corner', label: 'R Short' },
  't': { id: 'left-paint',         label: 'L Paint' },
  'f': { id: 'top-paint',          label: 'Top Paint' },
  'h': { id: 'right-paint',        label: 'R Paint' },
  'g': { id: 'left-elbow',         label: 'L Elbow' },
  'j': { id: 'right-elbow',        label: 'R Elbow' },
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
