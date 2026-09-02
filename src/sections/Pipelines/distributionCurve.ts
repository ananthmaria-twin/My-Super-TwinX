export function buildDistributionCurve(mean: number, ciLow: number, ciHigh: number, points = 40) {
  const std = Math.max(Math.abs(ciHigh - ciLow) / 4, Math.abs(mean) * 0.05, 0.01);
  const min = mean - std * 3;
  const max = mean + std * 3;
  const step = (max - min) / points;

  return Array.from({ length: points + 1 }, (_, i) => {
    const x = min + step * i;
    const density = Math.exp(-0.5 * ((x - mean) / std) ** 2);
    return { x: Number(x.toFixed(3)), density: Number(density.toFixed(4)) };
  });
}
