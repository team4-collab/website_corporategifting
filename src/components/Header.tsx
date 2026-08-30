import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Premium Gifting Co.
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          <Link href="/build-your-gift-box" className="hover:text-foreground">
            Build Your Gift Box
          </Link>
        </nav>
      </div>
    </header>
  );
}
