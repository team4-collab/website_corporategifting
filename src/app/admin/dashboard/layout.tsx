import Link from "next/link";
import { logout } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin/dashboard/enquiries", label: "Enquiries" },
  { href: "/admin/dashboard/products", label: "Products" },
  { href: "/admin/dashboard/categories", label: "Categories" },
  { href: "/admin/dashboard/discounts", label: "Discounts" },
  { href: "/admin/dashboard/festive-banner", label: "Festive Banner" },
  { href: "/admin/dashboard/settings", label: "Contact & WhatsApp" },
  { href: "/admin/dashboard/media", label: "Media Library" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-card p-4">
        <p className="mb-4 px-2 text-sm font-semibold">Admin</p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-background hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-6">
          <button className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-muted hover:bg-background hover:text-foreground">
            Sign Out
          </button>
        </form>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
