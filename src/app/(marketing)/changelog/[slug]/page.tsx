import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

// Define the directory where MDX files are stored
const CONTENT_DIR = path.join(process.cwd(), "content", "changelog");

// Function to get a single post by slug
async function getPost(slug: string) {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    return { frontmatter: data, content };
  } catch (error) {
    return null;
  }
}

// Function to generate static paths for all MDX files
export async function generateStaticParams() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("."))
    .map((file) => ({
      slug: file.replace(".mdx", ""),
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Not Found | BrandForge" };
  
  return {
    title: `${post.frontmatter.title} | BrandForge Changelog`,
    description: post.frontmatter.description,
  };
}

export default async function ChangelogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Custom components for the MDX renderer
  const components = {
    h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4 tracking-tight" style={{ fontFamily: "var(--font-outfit), sans-serif" }} {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-[var(--text-primary)]" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-[var(--text-primary)]" {...props} />,
    p: (props: any) => <p className="text-[var(--text-secondary)] mb-4 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-[var(--text-secondary)] marker:text-[var(--accent-cyan)]" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-[var(--text-secondary)] marker:text-[var(--accent-cyan)]" {...props} />,
    li: (props: any) => <li {...props} />,
    a: (props: any) => <a className="text-[var(--accent-cyan)] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    strong: (props: any) => <strong className="font-bold text-[var(--text-primary)]" {...props} />,
    code: (props: any) => <code className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--text-primary)]" {...props} />,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/changelog" className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Changelog
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {post.frontmatter.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {post.frontmatter.author && (
              <>
                <span>•</span>
                <span>By {post.frontmatter.author}</span>
              </>
            )}
          </div>
        </div>

        <div className="glass-card p-6 md:p-10 border border-[var(--border)]">
          <article className="prose-mdx">
            <MDXRemote source={post.content} components={components} />
          </article>
        </div>
      </div>
    </div>
  );
}
