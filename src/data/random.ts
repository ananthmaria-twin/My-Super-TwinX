// Deterministic pseudo-random generator so synthetic data is stable across renders.
export function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRange(seed: number, min: number, max: number, decimals = 0) {
  const rnd = mulberry32(seed)();
  const val = min + rnd * (max - min);
  return decimals > 0 ? Number(val.toFixed(decimals)) : Math.round(val);
}

export function makeRows<T>(count: number, seedBase: number, factory: (rnd: () => number, i: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => factory(mulberry32(seedBase + i * 97), i));
}
