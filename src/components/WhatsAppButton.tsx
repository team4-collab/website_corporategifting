import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton({
  whatsappNumber,
  message,
  className,
}: {
  whatsappNumber: string;
  message?: string;
  className?: string;
}) {
  const href = buildWhatsAppLink(
    whatsappNumber,
    message ?? "Hi! I'd like to enquire about corporate gifting.",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
      }
    >
      WhatsApp Us
    </a>
  );
}
