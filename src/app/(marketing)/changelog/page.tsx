import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import TopBar from "@/components/layout/TopBar";

export const metadata = {
  title: "Changelog | QuadBrand",
  description: "New updates and improvements to QuadBrand.",
};

async function getChangelogPosts() {
  const contentDir = path.join(process.cwd(), "content", "changelog");
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const fileNames = fs.readdirSync(contentDir);

  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map(async (fileName) => {
        const filePath = path.join(contentDir, fileName);
        const fileContent = fs.readFileSync(filePath, "utf8");

        const { frontmatter, content } = await compileMDX<{
          title: string;
          date: string;
          description: string;
        }>({
          source: fileContent,
          options: { parseFrontmatter: true },
        });

        return {
          slug: fileName.replace(/\.mdx$/, ""),
          frontmatter,
          content,
        };
      })
  );

  // Sort by date descending
  return posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export default async function ChangelogPage() {
  const posts = await getChangelogPosts();

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <TopBar />
      
      <main className="max-w-3xl mx-auto px-4 py-24">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            Changelog
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            New updates and improvements to QuadBrand.
          </p>
        </div>

        <div className="space-y-16">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.slug} className="glass-card p-8 md:p-12">
                <header className="mb-8 border-b border-[var(--border)] pb-8">
                  <time className="text-sm text-[var(--accent-cyan)] font-mono mb-3 block">
                    {new Date(post.frontmatter.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                    {post.frontmatter.title}
                  </h2>
                  {post.frontmatter.description && (
                    <p className="text-[var(--text-secondary)] text-lg">
                      {post.frontmatter.description}
                    </p>
                  )}
                </header>
                <div className="prose prose-invert prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] max-w-none prose-a:text-[var(--accent-cyan)]">
                  {post.content}
                </div>
              </article>
            ))
          ) : (
            <p className="text-[var(--text-secondary)]">No updates yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
