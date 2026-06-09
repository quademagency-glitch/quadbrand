// Using native node fetch

const API_KEY = process.env.TEST_API_KEY || ''; // Must pass this to env
const API_URL = 'http://localhost:3000/api/v1';

async function testApi() {
  if (!API_KEY) {
    console.log("No TEST_API_KEY provided in env.");
    return;
  }

  console.log(`Testing Public API with key: ${API_KEY.substring(0, 10)}...`);

  // 1. Fetch Brands
  console.log("\n1. Fetching Brands...");
  const brandsRes = await fetch(`${API_URL}/brands`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  const brandsData = await brandsRes.json();
  console.log("Brands Response:", brandsData);

  if (!brandsData.brands || brandsData.brands.length === 0) {
    console.log("No brands available to generate for.");
    return;
  }

  const brandId = brandsData.brands[0].id;

  // 2. Generate Image
  console.log("\n2. Triggering Image Generation...");
  const generateRes = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: "A beautiful cinematic shot of a coffee cup on a wooden table, morning light.",
      aspectRatio: "1:1",
      modelId: "fast",
      brandId: brandId
    })
  });
  const generateData = await generateRes.json();
  console.log("Generate Response:", generateData);

  if (!generateData.data || generateData.data.length === 0) return;

  const imageId = generateData.data[0].id;

  // 3. Poll Image Status
  console.log(`\n3. Fetching Image ID: ${imageId}...`);
  const imageRes = await fetch(`${API_URL}/images/${imageId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  const imageData = await imageRes.json();
  console.log("Image Response:", imageData);
}

testApi();
