import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Browser mcpX",
  description:
    "Privacy Policy for Browser mcpX extension and services. Learn how we handle your data and protect your privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75">
        <div className="mx-auto flex h-14 items-center px-4 md:px-6 lg:px-8 max-w-6xl">
          <Link
            href="/"
            className="mr-4 md:mr-6 flex items-center space-x-2 text-sm font-medium"
          >
            <span className="text-zinc-400 hover:text-zinc-100 transition-colors">
              ← Back to Home
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white text-black grid place-items-center">
              <span className="text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-medium tracking-tight">
              Browser mcpX
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-zinc prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-h1:text-4xl prose-h1:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-7 prose-a:font-medium prose-a:text-zinc-100 prose-a:underline prose-a:decoration-zinc-500 hover:prose-a:decoration-zinc-300 prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-400 prose-strong:text-zinc-100 prose-code:text-zinc-100 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-th:text-zinc-100 prose-td:text-zinc-300">
          <h1>Privacy Policy</h1>

          <p className="text-lg text-zinc-400 mb-8">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-8">
            <h3 className="mt-0 mb-4">Quick Summary</h3>
            <p className="mb-0">
              Browser mcpX respects your privacy. We only collect minimal
              technical data necessary for functionality, never store personal
              browsing data, and you maintain full control over the extension
              and your information.
            </p>
          </div>

          <h2>1. Introduction</h2>

          <p>
            This Privacy Policy describes how Browser mcpX ("we", "our", or
            "us") collects, uses, and protects information when you use our
            browser extension and related services. This policy applies to:
          </p>

          <ul>
            <li>The Browser mcpX Chrome extension</li>
            <li>The mcpX MCP (Model Context Protocol) server</li>
            <li>Our documentation website</li>
            <li>Any related services and tools</li>
          </ul>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Browser Extension</h3>

          <p>
            The Browser mcpX extension operates with minimal data collection:
          </p>

          <h4>Automatically Collected:</h4>
          <ul>
            <li>
              <strong>Extension State</strong>: Connection status, active tab
              information, and extension preferences
            </li>
            <li>
              <strong>Technical Data</strong>: Browser version, extension
              version, and error logs for debugging
            </li>
            <li>
              <strong>DOM Interaction Data</strong>: Only when explicitly
              requested by connected AI clients for automation tasks
            </li>
          </ul>

          <h4>Never Collected:</h4>
          <ul>
            <li>Browsing history or personal browsing habits</li>
            <li>Passwords, form data, or authentication credentials</li>
            <li>Personal files or sensitive documents</li>
            <li>Location data or device identifiers</li>
            <li>Content from private or incognito browsing sessions</li>
          </ul>

          <h3>2.2 MCP Server</h3>

          <p>
            The mcpX server processes automation commands and may temporarily
            handle:
          </p>

          <ul>
            <li>
              <strong>Command Logs</strong>: Automation commands sent from AI
              clients (retained locally only)
            </li>
            <li>
              <strong>Session Data</strong>: Temporary connection information
              between browser and AI client
            </li>
            <li>
              <strong>Error Information</strong>: Technical errors for debugging
              and improvement purposes
            </li>
          </ul>

          <h3>2.3 Documentation Website</h3>

          <p>Our website may collect standard web analytics data:</p>

          <ul>
            <li>Page views and usage statistics</li>
            <li>General geographic location (country/region level)</li>
            <li>Referrer information and browser type</li>
          </ul>

          <h2>3. How We Use Information</h2>

          <p>Information collected is used solely for:</p>

          <h3>3.1 Core Functionality</h3>
          <ul>
            <li>
              Enabling browser automation as requested by connected AI clients
            </li>
            <li>
              Maintaining secure communication between extension and server
            </li>
            <li>Providing real-time feedback and status updates</li>
          </ul>

          <h3>3.2 Service Improvement</h3>
          <ul>
            <li>Debugging technical issues and improving performance</li>
            <li>Understanding usage patterns to enhance user experience</li>
            <li>Developing new features and capabilities</li>
          </ul>

          <h3>3.3 Security and Compliance</h3>
          <ul>
            <li>Preventing misuse and maintaining system security</li>
            <li>Complying with applicable laws and regulations</li>
            <li>Protecting against fraudulent or harmful activities</li>
          </ul>

          <h2>4. Data Storage and Retention</h2>

          <h3>4.1 Local Storage</h3>
          <p>
            Most data is stored locally on your device and never transmitted to
            external servers. This includes extension preferences, session data,
            and automation commands.
          </p>

          <h3>4.2 Temporary Data</h3>
          <p>
            Any data processed by the MCP server is temporary and automatically
            deleted when sessions end. We do not maintain persistent databases
            of user activity.
          </p>

          <h3>4.3 Log Retention</h3>
          <p>
            Technical logs for debugging purposes are retained for a maximum of
            30 days and are automatically purged thereafter.
          </p>

          <h2>5. Data Sharing and Third Parties</h2>

          <h3>5.1 No Sale of Personal Data</h3>
          <p>
            We do not sell, rent, or trade personal information to third parties
            under any circumstances.
          </p>

          <h3>5.2 Service Providers</h3>
          <p>
            We may share limited technical information with trusted service
            providers who assist in:
          </p>
          <ul>
            <li>Hosting and infrastructure services</li>
            <li>Analytics and performance monitoring</li>
            <li>Customer support and troubleshooting</li>
          </ul>

          <h3>5.3 Legal Requirements</h3>
          <p>
            Information may be disclosed if required by law, court order, or
            governmental request, or to protect our rights and users' safety.
          </p>

          <h2>6. Security Measures</h2>

          <p>We implement industry-standard security measures including:</p>

          <ul>
            <li>
              <strong>Encryption</strong>: All data transmission uses TLS/SSL
              encryption
            </li>
            <li>
              <strong>Access Controls</strong>: Strict limitations on who can
              access user data
            </li>
            <li>
              <strong>Regular Audits</strong>: Ongoing security assessments and
              improvements
            </li>
            <li>
              <strong>Minimal Permissions</strong>: Extension requests only
              necessary browser permissions
            </li>
            <li>
              <strong>Local Processing</strong>: Most operations occur locally
              on your device
            </li>
          </ul>

          <h2>7. Your Rights and Control</h2>

          <h3>7.1 Data Control</h3>
          <p>You maintain full control over your data and can:</p>
          <ul>
            <li>Disable the extension at any time</li>
            <li>Revoke permissions through browser settings</li>
            <li>Clear local storage and preferences</li>
            <li>Request deletion of any server-side data</li>
          </ul>

          <h3>7.2 Access and Portability</h3>
          <p>
            You can request access to any data we maintain about you, though
            most data remains on your local device under your direct control.
          </p>

          <h3>7.3 Opt-Out Options</h3>
          <p>
            You can opt out of analytics tracking and disable specific features
            while maintaining core functionality.
          </p>

          <h2>8. International Data Transfers</h2>

          <p>
            If data is transferred internationally, we ensure appropriate
            safeguards are in place through standard contractual clauses and
            compliance with applicable data protection laws.
          </p>

          <h2>9. Children's Privacy</h2>

          <p>
            Browser mcpX is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If we become aware of such collection, we will take immediate
            steps to delete the information.
          </p>

          <h2>10. Changes to This Policy</h2>

          <p>
            We may update this Privacy Policy periodically to reflect changes in
            our practices or applicable laws. Significant changes will be
            communicated through:
          </p>

          <ul>
            <li>Extension notifications</li>
            <li>Website announcements</li>
            <li>
              Email notifications (if you've provided contact information)
            </li>
          </ul>

          <p>
            The "Last updated" date at the top of this policy indicates when
            changes were last made.
          </p>

          <h2>11. Contact Information</h2>

          <p>
            For questions, concerns, or requests regarding this Privacy Policy
            or your data, please contact us:
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mt-6">
            <h4 className="mt-0 mb-4">Contact Details</h4>
            <ul className="mb-0">
              <li>
                <strong>GitHub Issues</strong>:{" "}
                <a
                  href="https://github.com/Rudra78996/mcpX/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report privacy concerns
                </a>
              </li>
              <li>
                <strong>Project Repository</strong>:{" "}
                <a
                  href="https://github.com/Rudra78996/mcpX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Rudra78996/mcpX
                </a>
              </li>
              <li>
                <strong>Documentation</strong>:{" "}
                <Link href="/docs">Browse our documentation</Link>
              </li>
            </ul>
          </div>

          <h2>12. Compliance and Certifications</h2>

          <p>
            Browser mcpX is designed to comply with major privacy regulations
            including:
          </p>

          <ul>
            <li>
              <strong>GDPR</strong>: European General Data Protection Regulation
            </li>
            <li>
              <strong>CCPA</strong>: California Consumer Privacy Act
            </li>
            <li>
              <strong>Chrome Web Store Policies</strong>: Google's privacy and
              security requirements
            </li>
          </ul>

          <p>
            We are committed to maintaining the highest standards of privacy
            protection and welcome feedback on our privacy practices.
          </p>

          <hr className="my-8 border-zinc-800" />

          <p className="text-sm text-zinc-500">
            This Privacy Policy is effective as of the date listed above and
            applies to all users of Browser mcpX services. By using our
            extension and services, you acknowledge that you have read and
            understood this Privacy Policy.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>
            © {new Date().getFullYear()} Browser mcpX. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/docs"
              className="hover:text-zinc-300 transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/Rudra78996/mcpX"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
