import { parse } from "../src/parse";
import { realisticDoc } from "./generate";

const SIZES = (process.env.SIZES ?? "50,500,2000").split(",").map(Number);
const RUNS = Number(process.env.RUNS ?? 15);
const SEEDS = [1, 2, 3];
const REFERENCE_RATE = Number(process.env.REFERENCE_RATE ?? 0.12);

for (const size of SIZES) {
  const docs = SEEDS.map((seed) => realisticDoc(size, seed, { referenceRate: REFERENCE_RATE }));
  const iterations = Math.max(1, Math.round(20000 / size));
  let nodes = 0;
  let edges = 0;
  let errors = 0;
  const run = () => {
    for (const doc of docs) {
      try {
        const g = parse(doc);
        nodes += g.nodes.length;
        edges += g.edges.length;
      } catch {
        errors++;
      }
    }
  };
  for (let i = 0; i < 3; i++) run();
  const samples: number[] = [];
  for (let s = 0; s < RUNS; s++) {
    nodes = edges = errors = 0;
    const t0 = performance.now();
    for (let i = 0; i < iterations; i++) run();
    samples.push((performance.now() - t0) / (iterations * docs.length));
  }
  samples.sort((a, b) => a - b);
  const median = samples[Math.floor(samples.length / 2)]!;
  const perDoc = (n: number) => Math.round(n / (iterations * docs.length));
  console.log(
    `lines=${size} median_ms=${median.toFixed(4)} min=${samples[0]!.toFixed(4)} max=${samples[samples.length - 1]!.toFixed(4)} nodes=${perDoc(nodes)} edges=${perDoc(edges)} errors=${errors}`,
  );
}
