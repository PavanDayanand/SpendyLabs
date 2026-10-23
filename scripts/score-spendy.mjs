import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SR = 48_000;
const DURATION = 34.033;
const N = Math.ceil(SR * DURATION);
const left = new Float64Array(N);
const right = new Float64Array(N);
const output = resolve(
  process.argv[2] ?? "media/spendy-original-french-psych-pop.wav",
);
const beat = 60 / 110;
let seed = 0x5eed1234;

const random = () => {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 0x1_0000_0000;
};
const midi = (note) => 440 * 2 ** ((note - 69) / 12);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const smooth = (value) => value * value * (3 - 2 * value);

function add(time, duration, pan, gain, sample) {
  const start = Math.max(0, Math.floor(time * SR));
  const end = Math.min(N, start + Math.floor(duration * SR));
  const angle = ((clamp(pan, -1, 1) + 1) * Math.PI) / 4;
  const gl = Math.cos(angle) * gain;
  const gr = Math.sin(angle) * gain;
  for (let i = start; i < end; i += 1) {
    const t = (i - start) / SR;
    const value = sample(t, duration, i - start);
    if (!Number.isFinite(value)) throw new Error(`Invalid sample at ${time}s`);
    left[i] += value * gl;
    right[i] += value * gr;
  }
}

function env(t, duration, attack = 0.02, release = 0.25) {
  const a = smooth(clamp(t / attack, 0, 1));
  const r = smooth(clamp((duration - t) / release, 0, 1));
  return Math.min(a, r);
}

function pad(time, duration, notes, gain = 0.055) {
  const freqs = notes.flatMap((note) => [midi(note) * 0.997, midi(note) * 1.003]);
  add(time, duration, -0.08, gain, (t, d) => {
    const body = freqs.reduce(
      (sum, frequency, index) =>
        sum + Math.sin(2 * Math.PI * frequency * t + index * 0.71),
      0,
    ) / freqs.length;
    return body * env(t, d, 1.2, 1.6) * (0.78 + 0.22 * Math.sin(2 * Math.PI * 0.18 * t));
  });
}

function organ(time, duration, note, pan = 0, gain = 0.07) {
  const frequency = midi(note);
  add(time, duration, pan, gain, (t, d) => {
    const vibrato = 1 + 0.002 * Math.sin(2 * Math.PI * 5.1 * t);
    const phase = 2 * Math.PI * frequency * vibrato * t;
    const tone = Math.sin(phase) + 0.42 * Math.sin(2 * phase) + 0.18 * Math.sin(3 * phase);
    return (tone / 1.6) * env(t, d, 0.04, 0.28);
  });
}

function bass(time, note, gain = 0.14) {
  const frequency = midi(note);
  add(time, beat * 0.78, -0.05, gain, (t, d) => {
    const phase = 2 * Math.PI * frequency * t;
    const tone = Math.sin(phase) + 0.22 * Math.sin(2 * phase);
    return tone * env(t, d, 0.012, 0.16) * Math.exp(-t * 1.2);
  });
}

function pluck(time, note, pan, gain = 0.085) {
  const frequency = midi(note);
  add(time, beat * 0.82, pan, gain, (t, d) => {
    const tremolo = 0.68 + 0.32 * Math.sin(2 * Math.PI * 5.4 * t);
    const phase = 2 * Math.PI * frequency * t;
    const tone = Math.sin(phase) + 0.28 * Math.sin(2 * phase + 0.4);
    return tone * tremolo * env(t, d, 0.006, 0.22) * Math.exp(-t * 3.1);
  });
}

function kick(time, gain = 0.24) {
  add(time, 0.34, 0, gain, (t) => {
    const phase = 2 * Math.PI * (72 * t - 42 * t * t);
    return Math.sin(phase) * Math.exp(-t * 15);
  });
}

function snare(time, gain = 0.11) {
  let filtered = 0;
  add(time, 0.22, 0.04, gain, (t) => {
    const noise = random() * 2 - 1;
    filtered += 0.36 * (noise - filtered);
    return (noise - filtered * 0.35) * Math.exp(-t * 19);
  });
}

function hat(time, pan, gain = 0.035) {
  let low = 0;
  add(time, 0.085, pan, gain, (t) => {
    const noise = random() * 2 - 1;
    low += 0.16 * (noise - low);
    return (noise - low) * Math.exp(-t * 54);
  });
}

function tambourine(time, pan = 0.18, gain = 0.045) {
  let low = 0;
  add(time, 0.16, pan, gain, (t) => {
    const noise = random() * 2 - 1;
    low += 0.11 * (noise - low);
    const jingle =
      Math.sin(2 * Math.PI * 4200 * t) +
      0.55 * Math.sin(2 * Math.PI * 6150 * t + 0.7);
    return ((noise - low) * 0.7 + jingle * 0.3) * Math.exp(-t * 25);
  });
}

function guitarStrum(time, notes, pan, gain = 0.07) {
  notes.forEach((note, index) => {
    const frequency = midi(note + 12);
    add(time + index * 0.013, beat * 0.72, pan, gain / notes.length, (t, d) => {
      const tremolo = 0.72 + 0.28 * Math.sin(2 * Math.PI * 5.8 * t);
      const phase = 2 * Math.PI * frequency * t;
      const tone = Math.sin(phase) + 0.38 * Math.sin(2 * phase + 0.25);
      return tone * tremolo * env(t, d, 0.004, 0.24) * Math.exp(-t * 3.6);
    });
  });
}

function transition(time, gain = 0.09) {
  const start = Math.max(0, time - 0.34);
  let low = 0;
  add(start, 0.34, 0.16, gain, (t, d) => {
    const noise = random() * 2 - 1;
    const amount = t / d;
    low += (0.03 + amount * 0.22) * (noise - low);
    return low * amount * amount;
  });
  add(time, 0.5, 0, gain * 1.35, (t) => {
    const phase = 2 * Math.PI * (92 * t - 36 * t * t);
    return Math.sin(phase) * Math.exp(-t * 9.5);
  });
}

const chords = [
  [50, 57, 60, 65],
  [48, 55, 60, 64],
  [46, 53, 58, 62],
  [45, 52, 57, 61],
];
for (let t = 0, chord = 0; t < DURATION; t += beat * 4, chord += 1) {
  const current = chords[chord % chords.length];
  pad(t, Math.min(beat * 4.5, DURATION - t), current, t < 8.4 ? 0.032 : 0.04);
  if (t >= 4.8 && t < 30.5) {
    guitarStrum(t, current.slice(1), chord % 2 ? 0.24 : -0.24, t < 8.4 ? 0.045 : 0.07);
    guitarStrum(t + beat * 2.5, current.slice(1), chord % 2 ? -0.22 : 0.22, 0.05);
  }
}

for (let t = 0.7, step = 0; t < 8.4; t += beat * 2, step += 1) {
  organ(t, beat * 1.45, [69, 72, 67, 64][step % 4], step % 2 ? 0.18 : -0.18, 0.042);
}

const bassRoots = [38, 36, 34, 33];
for (let t = 8.45, step = 0; t < 27.55; t += beat, step += 1) {
  const sectionGain = t < 13.25 ? 0.115 : t > 21.8 && t < 24.25 ? 0.072 : 0.145;
  const root = bassRoots[Math.floor(step / 4) % bassRoots.length];
  bass(t, root + ([0, 7, 0, 12][step % 4] ?? 0), sectionGain);
  kick(t, t < 13.25 ? (step % 2 === 0 ? 0.16 : 0.08) : step % 4 === 2 ? 0.12 : 0.21);
  if (step % 4 === 1 || step % 4 === 3) snare(t, t < 13.25 ? 0.075 : 0.12);
  if (t >= 10.0) {
    hat(t, -0.24, 0.028);
    hat(t + beat / 2, 0.24, 0.024);
    tambourine(t + beat / 2, step % 2 ? -0.16 : 0.16, t < 13.25 ? 0.028 : 0.043);
  }
}

const motif = [69, 70, 69, 65, 64, 61, 62, 65];
for (let t = 13.25, step = 0; t < 21.82; t += beat / 2, step += 1) {
  if (step % 2 === 0 || step % 8 === 7) {
    pluck(t, motif[step % motif.length], step % 4 < 2 ? -0.3 : 0.3, 0.095);
  }
}
for (let t = 24.32, step = 0; t < 27.52; t += beat / 2, step += 1) {
  pluck(t, motif[(step + 3) % motif.length] + (step > 7 ? 12 : 0), step % 2 ? 0.3 : -0.3, 0.07);
}

for (const time of [5, 6.6, 9, 14.383, 17.133, 21.917, 24.317, 27.633, 30.633]) {
  transition(time, time === 30.633 ? 0.13 : 0.07);
}

organ(27.72, 2.7, 69, -0.2, 0.055);
organ(28.0, 2.5, 72, 0.2, 0.05);
organ(30.633, 3.25, 62, -0.1, 0.07);
organ(30.633, 3.25, 69, 0.1, 0.055);

for (const delaySeconds of [0.087, 0.139, 0.211]) {
  const delay = Math.floor(delaySeconds * SR);
  const amount = delaySeconds === 0.087 ? 0.1 : delaySeconds === 0.139 ? 0.065 : 0.04;
  for (let i = delay; i < N; i += 1) {
    const wetLeft = right[i - delay] * amount;
    const wetRight = left[i - delay] * amount;
    left[i] += wetLeft;
    right[i] += wetRight;
  }
}

let peak = 0;
for (let i = 0; i < N; i += 1) {
  const fadeIn = clamp(i / (SR * 0.15), 0, 1);
  const fadeOut = clamp((N - i) / (SR * 0.8), 0, 1);
  left[i] = Math.tanh(left[i] * 1.35) * fadeIn * fadeOut;
  right[i] = Math.tanh(right[i] * 1.35) * fadeIn * fadeOut;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
if (peak < 0.001) throw new Error("Generated score is silent");
const scale = 0.91 / peak;

const dataBytes = N * 4;
const wav = Buffer.alloc(44 + dataBytes);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + dataBytes, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(dataBytes, 40);
for (let i = 0; i < N; i += 1) {
  wav.writeInt16LE(Math.round(clamp(left[i] * scale, -1, 1) * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(clamp(right[i] * scale, -1, 1) * 32767), 46 + i * 4);
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, wav);
console.log(`Saved ${DURATION.toFixed(3)}s original score to ${output}`);
