// JS mirror of the CSS motion tokens in app/globals.css.
export const dur = { fast: 0.15, med: 0.25, slow: 0.4 } as const;

export const ease = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  spatial: [0.22, 1, 0.36, 1],
} as const;

export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 34 },
  soft: { type: "spring", stiffness: 160, damping: 24 },
} as const;
