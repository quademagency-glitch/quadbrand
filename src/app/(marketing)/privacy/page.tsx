import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — QuadBrand",
  description: "How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 container-narrow min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 
          className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[var(--text-tertiary)] mb-8">Last Updated: June 1, 2026</p>

        <div className="prose prose-invert prose-p:text-[var(--text-secondary)] prose-h2:text-[var(--text-primary)] prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-a:text-[var(--accent-cyan)] max-w-none">
          <p>
            At QuadBrand, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI visual generation services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            <strong>Account Data:</strong> We collect your email address, name, and profile picture when you sign up using Firebase Authentication or Google OAuth.
          </p>
          <p>
            <strong>Brand Data:</strong> When you onboard a brand, we store the website URL you provide, the generated color palettes, fonts, and brand summaries. This data is used solely to generate images for your specific workspace.
          </p>
          <p>
            <strong>Payment Data:</strong> We use Paystack as our payment processor. We do not store full credit card numbers on our servers. We only store your customer IDs and subscription status.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect primarily to provide, maintain, and improve our AI generation services. Your brand guidelines are used as context prompts for the diffusion models to ensure output consistency.
          </p>
          <p>
            We do <strong>not</strong> sell your data to third parties, nor do we use your generated images to train public AI models without your explicit consent.
          </p>

          <h2>3. Third-Party Services</h2>
          <p>
            We share limited data with necessary third-party service providers, including:
          </p>
          <ul>
            <li><strong>Replicate:</strong> For processing image generation requests (prompts and brand guidelines are sent via API).</li>
            <li><strong>Firecrawl / Mendable:</strong> For scraping public URLs during brand onboarding.</li>
            <li><strong>Google Cloud:</strong> For database hosting and storage of generated image assets.</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your account data and generated images for as long as your account is active. If you delete your account, we will purge your images and brand data from our active databases within 30 days.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@quadbrand.com">privacy@quadbrand.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
