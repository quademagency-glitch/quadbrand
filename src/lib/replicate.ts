import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImageWithFlux({
  prompt,
  aspect_ratio = "1:1",
  output_format = "webp",
}: {
  prompt: string;
  aspect_ratio?: "1:1" | "16:9" | "21:9" | "3:2" | "2:3" | "4:5" | "5:4" | "3:4" | "4:3" | "9:16" | "9:21" | string;
  output_format?: "webp" | "jpg" | "png";
}): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("Missing Replicate API token");
  }

  try {
    const input = {
      prompt,
      aspect_ratio,
      output_format,
      output_quality: 90,
      safety_tolerance: 2,
      prompt_upsampling: true
    };

    // Using FLUX.1.1-pro as specified in the plan
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      { input }
    );
    
    // Output is usually a string (URL) or readable stream. Wait, FLUX.1.1-pro returns a ReadableStream or URL depending on Replicate client version.
    // In newer Replicate SDK versions, returning FileOutput. Let's just stringify or return as any and cast.
    
    if (!output) {
      throw new Error("No output from Replicate");
    }

    return output.toString();
  } catch (error) {
    console.error("Replicate generation failed:", error);
    throw new Error("Failed to generate image");
  }
}
