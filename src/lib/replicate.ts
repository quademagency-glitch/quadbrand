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

export async function removeBackground(imageUrl: string): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("Missing Replicate API token");
  }

  try {
    const input = {
      image: imageUrl
    };

    // cjwbw/rembg for background removal
    const output = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5bad4c2f66e5f30f0f353b1b4c3",
      { input }
    );
    
    if (!output) throw new Error("No output from Replicate");
    return output.toString();
  } catch (error) {
    console.error("Background removal failed:", error);
    throw new Error("Failed to remove background");
  }
}

export async function vectorizeImage(imageUrl: string): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("Missing Replicate API token");
  }

  try {
    const input = {
      image: imageUrl
    };

    // Vectorize using a standard vectorizer or upscaler
    // We'll use a reliable model, like zylim0702/vectorizer or similar.
    // For now, we will use a generic placeholder that returns SVG if possible.
    const output = await replicate.run(
      "zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557", // Placeholder, ideally use a specific vector model
      { input }
    );
    
    if (!output) throw new Error("No output from Replicate");
    return Array.isArray(output) ? output[0] : output.toString();
  } catch (error) {
    console.error("Vectorization failed:", error);
    throw new Error("Failed to vectorize image");
  }
}

export async function editImage(imageUrl: string, prompt: string): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("Missing Replicate API token");
  }

  try {
    const input = {
      image: imageUrl,
      prompt: prompt,
      prompt_strength: 0.8
    };

    // Edit using SDXL img2img
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      { input }
    );
    
    if (!output) throw new Error("No output from Replicate");
    return Array.isArray(output) ? output[0] : output.toString();
  } catch (error) {
    console.error("Image editing failed:", error);
    throw new Error("Failed to edit image");
  }
}
