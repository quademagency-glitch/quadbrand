import { Metadata } from "next";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — QuadBrand",
  description: "Get in touch with the QuadBrand team.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 container-narrow min-h-screen">
      <div className="max-w-xl mx-auto text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Have a question about pricing, enterprise plans, or API access? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        {/* Contact Form */}
        <div className="md:col-span-3 glass-card p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 focus:border-[var(--accent-cyan)] transition-colors outline-none" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 focus:border-[var(--accent-cyan)] transition-colors outline-none" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 focus:border-[var(--accent-cyan)] transition-colors outline-none" placeholder="jane@company.com" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 focus:border-[var(--accent-cyan)] transition-colors outline-none resize-none" placeholder="How can we help you?"></textarea>
            </div>

            <button type="button" className="btn-gradient w-full !py-3">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-[var(--accent-cyan)]" />
            </div>
            <h3 className="text-lg font-bold mb-1">Email Us</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">For general inquiries and support.</p>
            <a href="mailto:hello@quadbrand.com" className="text-sm font-medium text-[var(--accent-cyan)] hover:underline">hello@quadbrand.com</a>
          </div>

          <div>
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-[var(--accent-magenta)]" />
            </div>
            <h3 className="text-lg font-bold mb-1">Sales</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">Looking for a custom enterprise plan?</p>
            <a href="mailto:sales@quadbrand.com" className="text-sm font-medium text-[var(--accent-magenta)] hover:underline">sales@quadbrand.com</a>
          </div>

          <div>
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-[var(--accent-purple)]" />
            </div>
            <h3 className="text-lg font-bold mb-1">Office</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              123 AI Boulevard<br />
              San Francisco, CA 94107<br />
              United States
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
