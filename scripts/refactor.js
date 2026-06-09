const fs = require('fs');
const path = require('path');

const files = [
  "src/app/api/analytics/route.ts",
  "src/app/api/reference-ads/route.ts",
  "src/app/(app)/referrals/page.tsx",
  "src/app/(app)/analytics/page.tsx",
  "src/app/api/webhooks/route.ts",
  "src/app/api/images/route.ts",
  "src/app/api/user/key/route.ts",
  "src/app/api/workspace/invite/route.ts",
  "src/app/api/images/process/route.ts",
  "src/app/(app)/workspace/developer/page.tsx",
  "src/app/api/generate/route.ts",
  "src/app/api/brands/onboard/route.ts",
  "src/app/api/billing/checkout/route.ts"
];

const importToReplace = 'import { getSession } from "@/lib/firebase/auth";';
const newImport = 'import { createClient } from "@/lib/supabase/server";';

const callToReplace = 'const session = await getSession();';
const newCall = `const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;`;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace import
    content = content.replace(importToReplace, newImport);
    
    // Replace call
    content = content.replace(callToReplace, newCall);
    
    // some might have different indentation
    content = content.replace('  const session = await getSession();', 
`  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;`);
  
    content = content.replace('    const session = await getSession();', 
`    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;`);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
}
