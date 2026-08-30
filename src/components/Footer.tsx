import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const socials = settings?.social_links ?? {};

  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 text-sm sm:grid-cols-3">
        <div>
          <h3 className="font-display text-base font-medium">Contact</h3>
          <div className="mt-3 space-y-1 text-muted">
            <p>{settings?.address ?? "Address coming soon"}</p>
            <p>{settings?.phone ?? ""}</p>
            <p>{settings?.email ?? ""}</p>
          </div>
        </div>

        <div>
          <h3 className="font-display text-base font-medium">Reach us instantly</h3>
          <div className="mt-3">
            {settings?.whatsapp_number ? (
              <WhatsAppButton
                whatsappNumber={settings.whatsapp_number}
                message={settings.whatsapp_message_template ?? undefined}
              />
            ) : (
              <p className="text-muted">WhatsApp coming soon</p>
            )}
          </div>
        </div>

        {Object.keys(socials).length > 0 && (
          <div>
            <h3 className="font-display text-base font-medium">Follow us</h3>
            <ul className="mt-3 space-y-1.5">
              {Object.entries(socials).map(([label, url]) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted capitalize transition hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Premium Gifting Co. All rights reserved.
      </div>
    </footer>
  );
}
