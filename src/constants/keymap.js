export const PLAYER_KEYS = ['1','2','3','4','5','6','7','8','9','0'];

export const SHOT_TYPE_KEYS = {
  'a': { id: '2pt', label: '2-Point' },
  's': { id: '3pt', label: '3-Point' },
  'd': { id: 'ft',  label: 'Free Throw' },
};

export const ZONE_KEYS = {
  'z': { id: 'left-corner',  label: 'Left Corner' },
  'x': { id: 'left-wing',    label: 'Left Wing' },
  'c': { id: 'top-key',      label: 'Top of Key' },
  'v': { id: 'right-wing',   label: 'Right Wing' },
  'b': { id: 'right-corner', label: 'Right Corner' },
  'f': { id: 'paint',        label: 'Paint' },
  'g': { id: 'ft-line',      label: 'FT Line' },
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
