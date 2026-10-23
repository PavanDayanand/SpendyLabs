import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pipeline } from "node:stream/promises";

const outputAudio = resolve(
  process.argv[2] ?? "media/spendy-original-soundtrack.mp3",
);

await mkdir(dirname(outputAudio), { recursive: true });

const client = new ElevenLabsClient();
const audio = await client.music.compose({
  prompt:
    "Create an entirely original instrumental soundtrack for a 34-second minimal monochrome finance app launch video. Around 110 BPM with restrained retro European psychedelic pop character: muted analog bass, tight dry drums, subtle tremolo guitar, airy vintage organ, understated hand percussion, and warm tape texture. No vocals, lyrics, quotations, or recognizable melodies. Begin sparse and curious; introduce a soft pulse near 8.5 seconds; form a confident groove near 13.3 seconds; lightly accent visual changes around 17.1, 21.9, and 24.3 seconds; create a brief breath near 27.6 seconds; resolve cleanly at 30.6 seconds and leave a polished tail through 34 seconds. Keep it elegant and subtle beneath product text, never busy or comedic.",
  musicLengthMs: 34_033,
  modelId: "music_v2_5",
  forceInstrumental: true,
  outputFormat: "mp3_48000_192",
});

await pipeline(audio, createWriteStream(outputAudio));
console.log(`Saved original soundtrack to ${outputAudio}`);
