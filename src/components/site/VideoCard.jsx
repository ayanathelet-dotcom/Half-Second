import { Play } from "lucide-react";
import Thumb from "../ui/Thumb.jsx";

export default function VideoCard({ video, onPlay, featured = false }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className={`group text-left ${featured ? "sm:col-span-2 lg:row-span-2" : ""}`}
      aria-label={`Play ${video.name}`}
    >
      <div className="relative">
        <Thumb video={video} className="aspect-video rounded-[6px]" />
        <span className="absolute inset-0 grid place-items-center">
          <span
            className={`grid place-items-center rounded-full bg-signal text-ink transition-transform duration-200 group-hover:scale-110 ${
              featured ? "size-16" : "size-12"
            }`}
          >
            <Play className={`fill-current ${featured ? "size-7" : "size-5"}`} />
          </span>
        </span>
      </div>
      <h3 className={`mt-3.5 font-bold ${featured ? "text-2xl" : "text-lg"}`}>{video.name}</h3>
      {video.description && (
        <p className="mt-1 line-clamp-2 max-w-xl text-[0.95rem] leading-relaxed text-mute-dark">
          {video.description}
        </p>
      )}
    </button>
  );
}
