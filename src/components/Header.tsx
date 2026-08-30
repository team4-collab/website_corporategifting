import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl font-medium">
          Premium Gifting Co.
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <Link
            href="/build-your-gift-box"
            className="rounded-full border border-border px-4 py-1.5 transition hover:border-accent hover:text-foreground"
          >
            Build Your Gift Box
          </Link>
        </nav>
      </div>
    </header>
  );
}
