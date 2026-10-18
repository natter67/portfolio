"use client";

import { useState } from "react";

/**
 * Autodesk Fusion model, click-to-load. The viewer is several MB of
 * third-party JS, so the page shows a still (passed in as children) until
 * someone asks for the live, rotatable model.
 */
export default function CadEmbed({
  embed,
  share,
  title,
  children,
}: {
  embed: string;
  share: string;
  title: string;
  children: React.ReactNode;
}) {
  const [live, setLive] = useState(false);

  return (
    <figure className="mt-8">
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-line bg-surface">
        {live ? (
          <iframe
            src={embed}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            {children}
            <button
              type="button"
              onClick={() => setLive(true)}
              className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors hover:bg-ink/10"
            >
              <span className="bg-accent-fill px-5 py-2.5 text-sm font-semibold text-accent-on shadow-lg">
                Rotate the 3D model ⟳
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="specimen mt-3 flex flex-wrap justify-between gap-2 text-ink-2">
        <span>Fig. — {title}</span>
        <a href={share} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Open in Autodesk viewer ↗
        </a>
      </figcaption>
    </figure>
  );
}
