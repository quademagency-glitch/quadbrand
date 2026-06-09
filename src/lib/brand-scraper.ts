import FirecrawlApp from "@mendable/firecrawl-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface ExtractedBrandData {
  colors: string[];
  fonts: string[];
  aesthetic: string;
  industry: string;
  brand_summary: string;
}

export async function scrapeAndAnalyzeBrand(url: string): Promise<ExtractedBrandData> {
  if (!process.env.FIRECRAWL_API_KEY || !process.env.OPENAI_API_KEY) {
    throw new Error("Missing API keys for brand scraping");
  }

  const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY,
  });

  // 1. Scrape the URL using Firecrawl
  const scrapeResult = await firecrawl.scrapeUrl(url, {
    formats: ["markdown", "screenshot"],
  }) as any;

  if (scrapeResult.success === false) {
    throw new Error(`Failed to scrape URL: ${scrapeResult.error}`);
  }

  const data = scrapeResult.data || scrapeResult;
  const markdownContent = data.markdown || "";
  const screenshotUrl = data.screenshot || "";

  // 2. Analyze with OpenAI (gpt-4o-mini)
  const prompt = `
    You are an expert brand designer and marketing strategist. 
    Analyze the following brand website data (extracted as markdown).
    
    Website URL: ${url}
    
    Website Content:
    ${markdownContent.substring(0, 15000)} // Limit context size
    
    Task: Extract the core brand identity into a strictly formatted JSON object.
    
    Requirements:
    - colors: Array of 2 to 5 primary/accent hex color codes used by the brand. Ensure they include the '#' prefix.
    - fonts: Array of 1 to 3 font family names used or implied by the brand.
    - aesthetic: A concise, descriptive phrase of the brand's visual aesthetic (e.g., "Minimalist and modern", "Playful and vibrant", "Corporate and trustworthy").
    - industry: The core industry the brand operates in (e.g., "SaaS", "E-commerce", "Healthcare").
    - brand_summary: A 2-3 sentence summary of what the brand does and its target audience.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs strictly valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });
    
    const responseText = response.choices[0].message.content || "{}";
    const parsedData = JSON.parse(responseText) as ExtractedBrandData;
    
    return parsedData;
  } catch (error) {
    console.error("Failed to analyze brand with OpenAI:", error);
    throw new Error("Failed to analyze brand identity");
  }
}
