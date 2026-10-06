import { Film } from "lucide-react";

// Shows the ImageKit thumbnail. If it isn't ready yet, falls back to the video's first frame.
export default function Thumb({ video, className = "" }) {
  const url = video?.video?.url;
  const thumb = video?.video?.thumbnailUrl;
  return (
    <div className={`relative overflow-hidden bg-ink-2 ${className}`}>
      {thumb ? (
        <img src={thumb} alt="" loading="lazy" className="size-full object-cover" />
      ) : url ? (
        <video
          src={`${url}#t=0.5`}
          preload="metadata"
          muted
          playsInline
          className="size-full object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center text-mute-dark">
          <Film className="size-6" />
        </div>
      )}
    </div>
  );
}
