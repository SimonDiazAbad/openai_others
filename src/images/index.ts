import OpenAI from "openai";
import { ImageGenerateParams } from "openai/resources";
import { writeFileSync, readdirSync } from "fs";
import path from "path";

const openai = new OpenAI();

async function generateImage(
  prompt: string,
  response_format: ImageGenerateParams["response_format"] = "url"
) {
  const response = await openai.images.generate({
    prompt: prompt,
    model: "dall-e-3",
    style: "natural",
    n: 1,
    size: "1024x1024",
    quality: "hd",
    response_format: response_format,
  });

  if (response_format === "b64_json") {
    // we count how many images in ./images
    const storedImagesLength = readdirSync(
      path.join(__dirname, "../../outputs")
    ).length;
    const image = response.data[0].b64_json!;
    const filePath = path.join(
      __dirname,
      `../../outputs/image-${storedImagesLength}.png`
    );

    writeFileSync(filePath, Buffer.from(image, "base64"));

    console.log(`Image saved to ${filePath}`);
  }

  return response;
}

const response = generateImage(
  "an orange cat with closed eyes wearing a hat",
  "b64_json"
);
