import type { Photo } from "@/content/photos";

/**
 * AVIF → WebP <picture> with explicit dimensions. Fills its parent and never
 * crops: the whole image is shown (object-contain). If the parent's shape
 * differs from the photo's, the gap is filled with a soft blurred backdrop of
 * the same photo — or a flat `matte` color for renders and figures.
 */
export default function Picture({
  photo,
  sizes,
  priority = false,
  className = "",
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const set = (ext: string) =>
    photo.widths.map((w) => `/photos/${photo.id}-${w}.${ext} ${w}w`).join(", ");
  const fallback = photo.widths[Math.min(1, photo.widths.length - 1)];

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: photo.matte }}>
      {!photo.matte && (
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${photo.blur})` }}
        />
      )}
      <picture>
        <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
        <img
          src={`/photos/${photo.id}-${fallback}.webp`}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={`relative h-full w-full object-contain ${className}`}
        />
      </picture>
    </div>
  );
}
