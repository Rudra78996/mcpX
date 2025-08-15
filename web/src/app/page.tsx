import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg  bg-white text-black grid place-items-center">
            <span className="text-xs font-bold">M</span>
          </div>
          <span className="text-sm font-medium tracking-tight  ">
            Browser MCPX
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a
            href="#features"
            className="opacity-80 hover:opacity-100 transition"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="opacity-80 hover:opacity-100 transition"
          >
            How it works
          </a>
          <Link
            href="/docs"
            className="opacity-80 hover:opacity-100 transition"
          >
            Documentation
          </Link>
          <a href="#faq" className="opacity-80 hover:opacity-100 transition">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com"
            target="_blank"
            className="rounded-full border border-white/15 px-4 h-9 grid place-items-center text-sm text-white/90 hover:bg-white/10"
          >
            GitHub
          </Link>
          <Link
            href="#install"
            className="rounded-full bg-white text-black px-4 h-9 grid place-items-center text-sm font-medium hover:opacity-90"
          >
            Add to Chrome
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-24">
        <div className="text-center text-white">
          <div className="mx-auto size-16 rounded-2xl text-black grid place-items-center">
            <span className="text-lg font-extrabold">
              <Image src={"/t.png"} alt="Logo" width={64} height={64} />
            </span>
          </div>
          <h1 className="mt-8  md:text-6xl  tracking-tight text-center text-3xl font-medium  text-gray-50 sm:text-6xl">
            Browser{" "}
            <span className="animate-text-gradient inline-flex bg-gradient-to-r   bg-[200%_auto] bg-clip-text leading-tight text-transparent from-neutral-100 via-slate-400 to-neutral-400">
              {" "}
              McpX
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            Connect AI apps to your browser and automate tests and repetitive
            tasks. Minimal setup, strong controls, beautiful DX.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="#install"
              className="rounded-full bg-white text-black px-5 h-11 grid place-items-center text-sm sm:text-base font-medium hover:opacity-90"
            >
              Add to Chrome
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-white/15 text-white/90 px-5 h-11 grid place-items-center text-sm sm:text-base hover:bg-white/10"
            >
              Documentation
            </Link>
          </div>
        </div>

        {/* Features */}
        <section
          id="features"
          className="mt-24 grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {[
            {
              title: "Point & Automate",
              desc: "Target DOM elements and let MCPX drive clicks, typing, and navigation.",
              icon: "cursor",
            },
            {
              title: "Deterministic",
              desc: "Explicit tools with clear permissions keep your flows predictable.",
              icon: "shield",
            },
            {
              title: "Type-safe SDK",
              desc: "A tiny client for your AI app to talk to the browser reliably.",
              icon: "code",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/15 p-6 bg-white/5 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-black/30"
            >
              <div className="size-10 rounded-xl bg-white text-black grid place-items-center">
                <span className="text-sm">
                  {f.icon === "cursor"
                    ? "➚"
                    : f.icon === "shield"
                    ? "🛡️"
                    : "</>"}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-24 grid md:grid-cols-2 gap-10 items-center"
        >
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-white/80">
              <li>1. Install the extension and grant minimal permissions.</li>
              <li>
                2. Connect your AI app via MCP tools exposed by the extension.
              </li>
              <li>
                3. Script flows: open pages, click, type, assert, and collect
                data.
              </li>
            </ol>
            <div className="mt-6 flex gap-3">
              <Link
                href="/docs"
                className="rounded-full border border-black/10 dark:border-white/15 px-4 h-10 grid place-items-center text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                Read docs
              </Link>
              <Link
                href="#examples"
                className="rounded-full px-4 h-10 grid place-items-center text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
              >
                See examples
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 rounded-2xl border border-white/15 p-6 bg-white/5 backdrop-blur-sm">
            <Image
              src="/window.svg"
              alt="Browser"
              width={600}
              height={360}
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* CTA */}
        <section id="install" className="mt-28 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 px-5 h-12 bg-white/5 backdrop-blur-sm">
            <span className="text-sm text-white/90">
              Ready to automate your browser?
            </span>
            <Link
              href="#"
              className="rounded-full bg-white text-black px-4 h-9 grid place-items-center text-sm font-medium"
            >
              Add to Chrome
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/60">
            Works with MCP-compatible AI apps like Cursor and Claude.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/15 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/80">
          <span className="opacity-70">
            © {new Date().getFullYear()} Browser MCPX
          </span>
          <div className="flex items-center gap-4 opacity-80">
            <Link href="#privacy">Privacy</Link>
            <Link href="#terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
