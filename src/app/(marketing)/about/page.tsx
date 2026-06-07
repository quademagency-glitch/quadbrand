import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — QuadBrand",
  description: "Our mission to democratize premium brand design through AI.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 container-narrow min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Democratizing <span className="gradient-text">Great Design</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          We believe that every startup, creator, and small business deserves to look like a million bucks. QuadBrand was built to bridge the gap between expensive design agencies and do-it-yourself templates.
        </p>
      </div>

      <div className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-cyan)]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-magenta)]/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>
              Founded in 2026, QuadBrand emerged from a simple frustration: why does maintaining brand consistency across marketing channels have to be so difficult and expensive?
            </p>
            <p>
              Our founders, a mix of machine learning engineers and brand designers, realized that the latest advancements in diffusion models and multimodal AI could be harnessed to solve this exact problem. We spent months fine-tuning workflows to ensure that the AI doesn't just generate generic images, but truly understands and respects the visual DNA of a brand.
            </p>
            <p>
              Today, QuadBrand serves thousands of marketers, saving them countless hours in Figma and eliminating the need for expensive photoshoots.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Innovation First", desc: "We constantly push the boundaries of what generative AI can do for design." },
          { title: "Quality Obsessed", desc: "If it doesn't look like it belongs in a high-end magazine, it's not good enough." },
          { title: "User Empowerment", desc: "We build tools that make you feel like you have a 10-person agency in your pocket." },
        ].map((value, i) => (
          <div key={i} className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
            <h3 className="text-lg font-bold mb-2">{value.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{value.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
