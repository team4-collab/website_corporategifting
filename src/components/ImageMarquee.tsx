import Image from "next/image";

type MarqueeImage = {
  url: string;
  alt: string;
};

export function ImageMarquee({ images }: { images: MarqueeImage[] }) {
  if (images.length === 0) return null;

  // Doubled so the track can loop seamlessly at -50%.
  const track = [...images, ...images];

  return (
    <div
      className="relative w-full overflow-hidden py-6"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max animate-[marquee_48s_linear_infinite] gap-5 motion-reduce:animate-none">
        {track.map((image, i) => (
          <div
            key={i}
            className="relative h-36 w-52 shrink-0 overflow-hidden rounded-2xl shadow-[0_8px_24px_-8px_rgba(31,35,40,0.25)] sm:h-44 sm:w-64"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
