import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const socials = settings?.social_links ?? {};

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-muted">{settings?.address ?? "Address coming soon"}</p>
          <p className="text-muted">{settings?.phone ?? ""}</p>
          <p className="text-muted">{settings?.email ?? ""}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Reach us instantly</h3>
          {settings?.whatsapp_number ? (
            <WhatsAppButton
              whatsappNumber={settings.whatsapp_number}
              message={settings.whatsapp_message_template ?? undefined}
            />
          ) : (
            <p className="text-muted">WhatsApp coming soon</p>
          )}
        </div>

        {Object.keys(socials).length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Follow us</h3>
            <ul className="space-y-1">
              {Object.entries(socials).map(([label, url]) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground capitalize"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Premium Gifting Co. All rights reserved.
      </div>
    </footer>
  );
}
