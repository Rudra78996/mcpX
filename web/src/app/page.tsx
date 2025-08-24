"use client";

import { TextAnimate } from "@/components/ui/text-animate";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { NumberTicker } from "@/components/ui/number-ticker";
import { WordRotate } from "@/components/ui/word-rotate";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/magicui/marquee";
import HeroButton from "@/components/heroButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Chrome,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  MousePointer,
  Code2,
  Terminal,
  Sparkles,
  Upload,
} from "lucide-react";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Home() {
  const features = [
    {
      Icon: Chrome,
      name: "Workflow Integration",
      description:
        "Connect and automate tasks across all your favorite tools and applications effortlessly.",
      href: "#integration",
      cta: "View Integrations",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
          <Chrome className="h-32 w-32 text-blue-500/20" />
        </div>
      ),
    },
    {
      Icon: Zap,
      name: "Lightning Fast",
      description:
        "Execute automated workflows and complete repetitive tasks in seconds, not hours.",
      href: "#speed",
      cta: "Learn More",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-110">
          <Zap className="h-24 w-24 text-yellow-500/30" />
        </div>
      ),
    },
    {
      Icon: Globe,
      name: "Cross Platform",
      description:
        "Works seamlessly across different operating systems and browsers.",
      href: "#platform",
      cta: "View Docs",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-110">
          <Globe className="h-24 w-24 text-green-500/30" />
        </div>
      ),
    },
    {
      Icon: Shield,
      name: "Secure & Reliable",
      description:
        "Built with security in mind and enterprise-grade reliability.",
      href: "#security",
      cta: "Security Details",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
          <Shield className="h-32 w-32 text-emerald-500/20" />
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="">
        <div className="relative flex w-full flex-col items-center justify-start px-4 pt-32 sm:px-6 sm:pt-24 md:pt-32 lg:px-8 mb-20">
          <AuroraBackground />
          <div className="z-10 flex items-center justify-center">
            <HeroButton />
          </div>

          <div className="flex w-full max-w-2xl flex-col space-y-4 overflow-hidden pt-8">
            <div className="text-center text-4xl font-medium leading-tight text-foreground sm:text-5xl md:text-6xl">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="inline-block px-1 md:px-2 text-balance font-semibold"
                as="span"
              >
                Automate
              </TextAnimate>
              <TextAnimate
                animation="blurInUp"
                by="word"
                delay={0.1}
                className="inline-block px-1 md:px-2 text-balance font-semibold"
                as="span"
              >
                your
              </TextAnimate>
              <TextAnimate
                animation="blurInUp"
                by="word"
                delay={0.2}
                className="inline-block px-1 md:px-2 text-balance font-semibold"
                as="span"
              >
                workflow
              </TextAnimate>
              <TextAnimate
                animation="blurInUp"
                by="word"
                delay={0.3}
                className="inline-block px-1 md:px-2 text-balance font-semibold"
                as="span"
              >
                with AI
              </TextAnimate>
            </div>

            <TextAnimate
              animation="slideUp"
              by="word"
              delay={0.6}
              className="mx-auto max-w-xl text-center text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-9 text-balance whitespace-pre-line"
              as="p"
            >
              {
                "Automate testing and tasks by linking AI apps directly to your browser."
              }
            </TextAnimate>
          </div>

          <div className="relative z-20 mx-auto mt-6 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 animate-in fade-in duration-700 delay-700">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a
                href="https://chromewebstore.google.com/detail/fjbloajdmlfghkejmkgboceindianlge?utm_source=item-share-cb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Add mcpX to Chrome"
                className="flex items-center gap-2"
              >
                Add to Chrome
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto opacity-70"
            >
              <Link
                href="http://docs.mcpx.tech/"
                aria-label="Open documentation"
                className="flex items-center gap-2"
              >
                Documentation
              </Link>
            </Button>
          </div>

          <div className="relative mx-auto flex w-full items-center justify-center animate-in fade-in duration-1000 delay-1200">
            <div
              className="relative mt-16 aspect-video max-w-[1200px] rounded-xl md:mt-28 flex items-center justify-center overflow-visible isolate ring-1 ring-white/10 bg-gradient-to-br from-white/5 to-white/0"
              id="demo-video"
            >
              <div
                className="pointer-events-none absolute z-0 left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-[40px] opacity-50 blur-[280px]"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(16,185,129,0.95) 0%, rgba(14,165,233,0.7) 50%, rgba(139,92,246,0.55) 100%)",
                }}
              />
              <div className="relative z-10 w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_94%,transparent_100%)]">
                <video
                  src="./demo-2.mp4"
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="aspect-video w-full h-full rounded-xl border border-white/10 object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
          <section
            id="how-it-works"
            className="relative mt-16 sm:mt-20 md:mt-36 px-4 py-24"
          >
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="mr-2 h-3 w-3 text-yellow-500" />
                  HOW IT WORKS
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                  Just{" "}
                  <NumberTicker
                    value={3}
                    className="text-4xl font-bold text-primary sm:text-5xl"
                  />{" "}
                  steps to get started
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Transform your workflow automation in minutes with our simple
                  three-step process
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Steps */}
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <Upload className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-red-600">
                          1.
                        </span>
                        <h3 className="text-xl font-semibold">
                          Add MCP Server
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Add the mcpX server in your MCP client (Claude, VS Code,
                        or Windsurf) to link automation to your workspace.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                        <Zap className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-yellow-600">
                          2.
                        </span>
                        <h3 className="text-xl font-semibold">
                          Install Chrome Extension
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Install the mcpX Chrome Extension from the Web Store to
                        turn your browser into an automation hub.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-purple-600">
                          3.
                        </span>
                        <h3 className="text-xl font-semibold">
                          Connect & Automate
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Connect the extension to your client and prompt the
                        cursor to automate browsing and testing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Mockup */}
                <div className="relative">
                  <div className="relative rounded-2xl border bg-background shadow-2xl overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 text-center text-sm text-muted-foreground">
                        mcpX Dashboard
                      </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-6">
                      {/* Workflow Status */}
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">
                          Automation Status
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium">
                                Test Website
                              </span>
                            </div>
                            <span className="text-sm text-green-600 font-medium">
                              Passed
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium">
                                Console Error Check
                              </span>
                            </div>
                            <span className="text-sm text-blue-600 font-medium">
                              Running
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                              <span className="text-sm font-medium">
                                Page Speed Audit
                              </span>
                            </div>
                            <span className="text-sm text-orange-600 font-medium">
                              Scheduled
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h3 className="font-semibold mb-2">Recent Activity</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>✓ Tested 5 websites successfully</div>
                          <div>⚡ Captured 18 console errors</div>
                          <div>📊 Generated 3 performance reports</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-4 py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <TextAnimate
              animation="slideUp"
              by="word"
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              as="h2"
            >
              Everything you need to automate
            </TextAnimate>
            <WordRotate
              className="mt-4 text-xl text-muted-foreground"
              words={[
                "workflows",
                "processes",
                "repetitive tasks",
                "productivity",
              ]}
            />
          </div>

          <div className="mt-20">
            <BentoGrid>
              {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="relative px-4 py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <MousePointer className="mr-2 h-3 w-3 text-yellow-500" />
              TOOLS
            </Badge>
            <TextAnimate
              animation="blurIn"
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              as="h2"
            >
              Every tool you need
            </TextAnimate>
            <p className="mt-4 text-lg text-muted-foreground">
              Browser automation made simple
            </p>
          </div>

          <div className="mt-16">
            <Marquee pauseOnHover className="[--duration:40s]">
              {[
                // Navigation & History Tools
                {
                  name: "open-tab",
                  description:
                    "Open new browser tabs with URLs and focus control",
                  icon: Globe,
                  category: "📱 Navigation",
                  color: "blue",
                },
                {
                  name: "tab-back",
                  description: "Navigate back in browser history",
                  icon: ArrowRight,
                  category: "📱 Navigation",
                  color: "blue",
                },
                {
                  name: "tab-forward",
                  description: "Navigate forward in browser history",
                  icon: ArrowRight,
                  category: "📱 Navigation",
                  color: "blue",
                },

                // Interaction & Scrolling Tools
                {
                  name: "tab-click",
                  description:
                    "Click elements using CSS selectors with timeout support",
                  icon: MousePointer,
                  category: "🖱️ Interaction",
                  color: "green",
                },
                {
                  name: "hover",
                  description:
                    "Hover over elements to trigger interactive states",
                  icon: MousePointer,
                  category: "🖱️ Interaction",
                  color: "green",
                },
                {
                  name: "tab-scroll",
                  description:
                    "Scroll pages or elements (up, down, left, right, top, bottom)",
                  icon: ArrowRight,
                  category: "🖱️ Interaction",
                  color: "green",
                },

                // Input & Keyboard Tools
                {
                  name: "type-text",
                  description:
                    "Type text into input fields with configurable delay",
                  icon: Code2,
                  category: "⌨️ Input",
                  color: "purple",
                },
                {
                  name: "press-key",
                  description:
                    "Simulate keyboard shortcuts with modifier key support",
                  icon: Terminal,
                  category: "⌨️ Input",
                  color: "purple",
                },

                // Capture & Monitoring Tools
                {
                  name: "screenshot",
                  description:
                    "Capture full-page or viewport screenshots (PNG/JPEG)",
                  icon: Chrome,
                  category: "📸 Capture",
                  color: "orange",
                },
                {
                  name: "snapshot",
                  description:
                    "Get DOM snapshots with interactive element detection",
                  icon: Globe,
                  category: "📸 Capture",
                  color: "orange",
                },
                {
                  name: "console-logs",
                  description:
                    "Retrieve browser console logs with level filtering",
                  icon: Terminal,
                  category: "📸 Capture",
                  color: "orange",
                },

                // Utility & Timing Tools
                {
                  name: "wait",
                  description:
                    "Wait for time, elements, or navigation with timeout control",
                  icon: Zap,
                  category: "⏱️ Utility",
                  color: "red",
                },
              ].map((tool, idx) => (
                <div
                  key={idx}
                  className="mx-4 flex w-80 items-center gap-4 rounded-xl border bg-background p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      tool.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : tool.color === "green"
                        ? "bg-green-100 text-green-600"
                        : tool.color === "purple"
                        ? "bg-purple-100 text-purple-600"
                        : tool.color === "orange"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {tool.name}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-muted/30"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-muted/30"></div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to know about mcpX and browser automation
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Q1 */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-medium">
                What is mcpX?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                mcpX is an automation layer for your browser powered by the
                Model Context Protocol (MCP). It combines an MCP server with a
                Chrome extension, allowing you to send prompts (like{" "}
                <em>&ldquo;test this website&rdquo;</em> or{" "}
                <em>&ldquo;get console errors&rdquo;</em>) and have them
                executed directly inside your browser.
              </AccordionContent>
            </AccordionItem>

            {/* Q3 */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-medium">
                What kind of tasks can mcpX automate?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                mcpX can run browser-based tasks such as testing websites,
                capturing console errors, filling forms, scraping page data,
                monitoring performance, and more — all controlled through
                natural language prompts sent via your MCP client.
              </AccordionContent>
            </AccordionItem>

            {/* Q4 */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-medium">
                Do I need coding skills to use mcpX?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                Not at all! mcpX is designed to be prompt-driven. You can simply
                type commands like <em>&ldquo;Run a speed audit&rdquo;</em> or{" "}
                <em>&ldquo;Check login form errors&rdquo;</em>, and mcpX
                executes them automatically. Advanced users can also extend it
                with custom scripts if needed.
              </AccordionContent>
            </AccordionItem>

            {/* Q5 */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-medium">
                Which MCP clients does mcpX work with?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                mcpX works with any MCP-compatible client, including Claude
                Desktop, VS Code (with MCP plugin), and Windsurf. Once
                connected, you can send prompts from your editor or AI assistant
                directly to your browser.
              </AccordionContent>
            </AccordionItem>

            {/* Q6 */}
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-lg font-medium">
                Where can I get support?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                You can reach us anytime at{" "}
                <Link
                  href="mailto:support@mcpx.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@mcpx.com
                </Link>
                . We also provide setup guides, tutorials, and a community space
                to help you get the most out of mcpX.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full border-t border-border bg-background py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-poppins">
          <p className="text-center sm:text-left">
            By{" "}
            <span className="text-foreground font-medium">
              Rudra Pratap Singh
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <a
              href="https://github.com/Rudra78996"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/rudrapratapsingh03/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
