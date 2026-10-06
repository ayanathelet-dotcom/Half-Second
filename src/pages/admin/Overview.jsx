import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import StatStrip from "../../components/admin/StatStrip.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Thumb from "../../components/ui/Thumb.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import VideoPlayerModal from "../../components/ui/VideoPlayerModal.jsx";
import { buttonClasses } from "../../components/ui/Button.jsx";
import { PageLoader } from "../../components/ui/Spinner.jsx";
import useTitle from "../../hooks/useTitle.js";
import { timeAgo } from "../../lib/format.js";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export default function Overview() {
  useTitle("Overview");
  const { admin } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    let on = true;
    Promise.all([
      api.get("/admin/videos/stats"),
      api.get("/admin/enquiries/stats"),
      api.get("/admin/enquiries", { params: { limit: 5 } }),
      api.get("/admin/videos", { params: { limit: 4 } }),
    ])
      .then(([vs, es, enq, vids]) => {
        if (on) setData({ vs: vs.data.data, es: es.data.data, enquiries: enq.data.data, videos: vids.data.data });
      })
      .catch((e) => on && setError(getErrorMessage(e)));
    return () => {
      on = false;
    };
  }, []);

  if (error) return <EmptyState title="Couldn't load your dashboard" text={error} />;
  if (!data) return <PageLoader />;

  const { vs, es, enquiries, videos } = data;
  const firstName = admin?.name?.split(" ")[0] || "there";

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        subtitle={es.new > 0 ? `You have ${es.new} new ${es.new === 1 ? "enquiry" : "enquiries"} waiting for a reply.` : "No new enquiries right now."}
        action={
          <Link to="/admin/videos" className={buttonClasses({ variant: "primary" })}>
            Upload a video
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <StatStrip
          title="Videos"
          to="/admin/videos"
          items={[
            { label: "Total", value: vs.total },
            { label: "Published", value: vs.published },
            { label: "Drafts", value: vs.draft },
          ]}
        />
        <StatStrip
          title="Enquiries"
          to="/admin/enquiries"
          items={[
            { label: "Total", value: es.total },
            { label: "New", value: es.new, highlight: es.new > 0 },
            { label: "Scheduled", value: es.scheduled },
            { label: "Completed", value: es.completed },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-line bg-panel">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-bold">Latest enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm font-semibold text-chroma hover:underline">View all</Link>
          </div>
          {enquiries.length === 0 ? (
            <p className="px-5 py-10 text-center text-mute">Enquiries from your website will show up here.</p>
          ) : (
            <ul>
              {enquiries.map((e) => (
                <li key={e._id} className="border-b border-line last:border-b-0">
                  <Link to="/admin/enquiries" className="flex items-center gap-4 px-5 py-3.5 hover:bg-ink/4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{e.name}</p>
                      <p className="truncate text-sm text-mute">{e.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge value={e.status} />
                      <span className="text-xs text-mute">{timeAgo(e.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-line bg-panel">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-bold">Latest uploads</h2>
            <Link to="/admin/videos" className="text-sm font-semibold text-chroma hover:underline">View all</Link>
          </div>
          {videos.length === 0 ? (
            <p className="px-5 py-10 text-center text-mute">Upload your first video to see it here.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 p-5">
              {videos.map((v) => (
                <li key={v._id}>
                  <button type="button" onClick={() => setActive(v)} className="block w-full text-left" aria-label={`Play ${v.name}`}>
                    <Thumb video={v} className="aspect-video rounded-[4px]" />
                    <p className="mt-2 truncate text-sm font-semibold">{v.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <VideoPlayerModal video={active} onClose={() => setActive(null)} />
    </>
  );
}
