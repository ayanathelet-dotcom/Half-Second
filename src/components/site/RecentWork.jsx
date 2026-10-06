import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api.js";
import VideoCard from "./VideoCard.jsx";
import VideoPlayerModal from "../ui/VideoPlayerModal.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import { buttonClasses } from "../ui/Button.jsx";
import { container } from "../../lib/status.js";

export default function RecentWork() {
  const [videos, setVideos] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let on = true;
    api
      .get("/videos", { params: { limit: 6 } })
      .then((r) => on && setVideos(r.data.data))
      .catch(() => on && setVideos([]));
    return () => {
      on = false;
    };
  }, []);

  return (
    <section className="on-dark bg-ink text-paper">
      <div className={`${container} py-20 md:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-[clamp(2.5rem,6vw,5rem)]">Recent work</h2>
          <Link to="/work" className={buttonClasses({ variant: "outlineLight" })}>
            View all work
          </Link>
        </div>

        <div className="mt-12 grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos === null &&
            [0, 1, 2].map((i) => (
              <div key={i} className={`animate-pulse ${i === 0 ? "sm:col-span-2" : ""}`}>
                <div className="aspect-video rounded-[6px] bg-ink-2" />
                <div className="mt-3.5 h-5 w-1/2 rounded bg-ink-2" />
              </div>
            ))}

          {videos?.map((v, i) => (
            <VideoCard key={v._id} video={v} featured={i === 0} onPlay={setActive} />
          ))}
        </div>

        {videos?.length === 0 && (
          <EmptyState dark title="New work is being cut" text="Check back soon to see our latest edits." />
        )}
      </div>
      <VideoPlayerModal video={active} onClose={() => setActive(null)} />
    </section>
  );
}
