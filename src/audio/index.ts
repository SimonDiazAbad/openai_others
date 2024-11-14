import OpenAI from "openai";
import { writeFileSync, readdirSync, createReadStream } from "fs";
import path from "path";

const openai = new OpenAI();

async function createTranscription() {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream(path.join(__dirname, "../../input/test-audio.m4a")),
    model: "whisper-1",
    language: "en",
  });

  console.log(response);

  return response;
}

async function createTranslation() {
  const response = await openai.audio.translations.create({
    file: createReadStream(path.join(__dirname, "../../input/caperucita.wav")),
    model: "whisper-1",
  });

  console.log(response);

  return response;
}

async function textToSpeech(text: string) {
  const response = await openai.audio.speech.create({
    input: text,
    model: "tts-1-hd",
    voice: "shimmer",
    response_format: "mp3",
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  const storedFilesLength = readdirSync(
    path.join(__dirname, "../../outputs")
  ).length;
  const filePath = path.join(
    __dirname,
    `../../outputs/audio-${storedFilesLength}.mp3`
  );
  writeFileSync(filePath, buffer);

  return response;
}

// const response = createTranscription();
// const response = createTranslation();
const response = textToSpeech(
  `This is a test for OpenAI text to speech.
    Let's hope it sounds good. Hi there!
    How are you? I bought a watchamacallit`
);
