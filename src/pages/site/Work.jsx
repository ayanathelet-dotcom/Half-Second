import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../../lib/api.js";
import VideoCard from "../../components/site/VideoCard.jsx";
import VideoPlayerModal from "../../components/ui/VideoPlayerModal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import useTitle from "../../hooks/useTitle.js";
import { container } from "../../lib/status.js";

export default function Work() {
  useTitle("Work");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    let on = true;
    setLoading(true);
    api
      .get("/videos", { params: { page, limit: 9 } })
      .then(({ data }) => {
        if (!on) return;
        setItems((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
        setPages(data.pagination.pages);
        setError("");
      })
      .catch((e) => on && setError(getErrorMessage(e)))
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, [page]);

  return (
    <>
      <section className={`${container} pb-14 pt-14 md:pb-20 md:pt-20`}>
        <h1 className="display text-[clamp(3rem,9vw,7.5rem)]">Our work</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
          A selection of recent edits. Press play on any of them to watch it full size.
        </p>
      </section>

      <section className="on-dark min-h-[50vh] bg-ink text-paper">
        <div className={`${container} py-14 md:py-20`}>
          {error && <EmptyState dark title="Couldn't load the work" text={error} />}

          {!error && !loading && items.length === 0 && (
            <EmptyState dark title="New work is being cut" text="Check back soon to see our latest edits." />
          )}

          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => (
              <VideoCard key={v._id} video={v} onPlay={setActive} />
            ))}
            {loading &&
              [0, 1, 2].map((i) => (
                <div key={`s${i}`} className="animate-pulse">
                  <div className="aspect-video rounded-[6px] bg-ink-2" />
                  <div className="mt-3.5 h-5 w-1/2 rounded bg-ink-2" />
                </div>
              ))}
          </div>

          {!loading && page < pages && (
            <div className="mt-14 flex justify-center">
              <Button variant="outlineLight" size="lg" onClick={() => setPage((p) => p + 1)}>
                Load more
              </Button>
            </div>
          )}
        </div>
        <VideoPlayerModal video={active} onClose={() => setActive(null)} />
      </section>
    </>
  );
}
