import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:aspect-[3/4]"
    >
      {category.image_url && (
        <Image
          src={category.image_url}
          alt=""
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,12,0.85)_0%,rgba(20,17,12,0.15)_55%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="font-display text-lg font-medium text-white sm:text-xl">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-xs text-white/75 line-clamp-2 sm:text-sm">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
