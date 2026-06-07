import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — QuadBrand",
  description: "Insights, updates, and tutorials from the QuadBrand team.",
};

const posts = [
  {
    title: "Introducing FLUX 1.1 Pro integration for all Premium Workspaces",
    excerpt: "We are thrilled to announce that we've upgraded our core generation engine to Black Forest Labs' latest state-of-the-art model.",
    date: "July 7, 2026",
    category: "Product Update",
    slug: "introducing-flux-1-1-pro",
    readTime: "3 min read"
  },
  {
    title: "How to maintain brand consistency in the era of Generative AI",
    excerpt: "Generative AI is powerful, but without constraints, it can dilute your visual identity. Here is how top marketing teams are solving this.",
    date: "June 24, 2026",
    category: "Strategy",
    slug: "brand-consistency-generative-ai",
    readTime: "6 min read"
  },
  {
    title: "The anatomy of a perfect image generation prompt",
    excerpt: "Stop wasting credits on bad generations. Learn the framework we use to consistently get production-ready marketing assets.",
    date: "June 12, 2026",
    category: "Tutorial",
    slug: "perfect-image-generation-prompt",
    readTime: "8 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-20 container-narrow min-h-screen">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          The QuadBrand <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Tips, tricks, and product updates to help you generate better visuals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col glass-card p-6 border border-[var(--border)] hover:border-[var(--accent-cyan)] transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-cyan)] bg-[var(--accent-cyan-light)] rounded-md">
                {post.category}
              </span>
              <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
            </div>
            
            <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-2">
              {post.title}
            </h2>
            
            <p className="text-sm text-[var(--text-secondary)] mb-6 flex-1 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-[var(--border)]">
              <span className="font-medium flex items-center gap-1 text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                Read article <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[var(--text-tertiary)]">
                {post.readTime}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
