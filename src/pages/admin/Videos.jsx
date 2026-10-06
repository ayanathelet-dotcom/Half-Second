import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Pencil, Play, Search, Trash2, Upload } from "lucide-react";
import api, { getErrorMessage } from "../../lib/api.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import UploadVideoModal from "../../components/admin/UploadVideoModal.jsx";
import EditVideoModal from "../../components/admin/EditVideoModal.jsx";
import VideoPlayerModal from "../../components/ui/VideoPlayerModal.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Button from "../../components/ui/Button.jsx";
import IconButton from "../../components/ui/IconButton.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Thumb from "../../components/ui/Thumb.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { inputClass } from "../../components/ui/Field.jsx";
import useTitle from "../../hooks/useTitle.js";
import { formatDate } from "../../lib/format.js";

const filters = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

export default function Videos() {
  useTitle("Videos");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // wait for typing to pause before searching
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/videos", {
        params: { page, limit: 10, status: status || undefined, search: search || undefined },
      });
      setItems(data.data);
      setPages(data.pagination.pages);
      setTotal(data.pagination.total);
      setError("");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (v) => {
    const next = v.status === "published" ? "draft" : "published";
    try {
      await api.patch(`/admin/videos/${v._id}`, { status: next });
      toast.success(next === "published" ? "Published" : "Moved to drafts");
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/admin/videos/${deleting._id}`);
      toast.success("Video deleted");
      setDeleting(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setDeleteBusy(false);
    }
  };

  const uploadButton = (
    <Button onClick={() => setUploadOpen(true)}>
      <Upload className="size-4" /> Upload video
    </Button>
  );

  return (
    <>
      <PageHeader title="Videos" subtitle="Everything you upload here is stored on ImageKit. Published videos appear on your website." action={uploadButton} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name"
            aria-label="Search videos by name"
            className={`${inputClass} pl-9`}
          />
        </div>
        <div className="flex rounded-[4px] border border-line bg-panel p-0.5" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={status === f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              className={`rounded-[3px] px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                status === f.value ? "bg-ink text-paper" : "text-mute hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {!loading && !error && <p className="tabular ml-auto text-sm text-mute">{total} {total === 1 ? "video" : "videos"}</p>}
      </div>

      {error ? (
        <EmptyState title="Couldn't load videos" text={error} action={<Button variant="outline" onClick={load}>Try again</Button>} />
      ) : loading && items.length === 0 ? (
        <div className="grid place-items-center py-24 text-mute"><Spinner className="size-6" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          title={search || status ? "No videos match" : "No videos yet"}
          text={search || status ? "Try a different search or filter." : "Upload your first video and it will appear on your website."}
          action={!search && !status ? uploadButton : null}
        />
      ) : (
        <ul className={`overflow-hidden rounded-xl border border-line bg-panel transition-opacity ${loading ? "opacity-60" : ""}`}>
          {items.map((v) => (
            <li key={v._id} className="grid grid-cols-[7rem_1fr] items-center gap-x-4 gap-y-3 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[9rem_1fr_auto]">
              <button type="button" onClick={() => setPlaying(v)} aria-label={`Play ${v.name}`} className="group relative">
                <Thumb video={v} className="aspect-video rounded-[4px]" />
                <span className="absolute inset-0 grid place-items-center rounded-[4px] bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/45 group-hover:opacity-100">
                  <Play className="size-6 fill-current" />
                </span>
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold">{v.name}</p>
                  <Badge kind="video" value={v.status} />
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-mute">{v.description || "No description"}</p>
                <p className="mt-0.5 text-xs text-mute">Uploaded {formatDate(v.createdAt)}</p>
              </div>

              <div className="col-span-2 flex justify-end gap-0.5 sm:col-span-1">
                <IconButton label={v.status === "published" ? "Unpublish (move to drafts)" : "Publish"} onClick={() => togglePublish(v)}>
                  {v.status === "published" ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </IconButton>
                <IconButton label="Edit details" onClick={() => setEditing(v)}>
                  <Pencil className="size-[18px]" />
                </IconButton>
                <IconButton label="Delete video" onClick={() => setDeleting(v)} className="hover:!text-danger">
                  <Trash2 className="size-[18px]" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} className="mt-6" />

      <UploadVideoModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={() => { setPage(1); load(); }} />
      <EditVideoModal video={editing} onClose={() => setEditing(null)} onSaved={load} />
      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Delete this video?"
        message={`"${deleting?.name || ""}" will be removed from your website and deleted from ImageKit. This can't be undone.`}
        confirmLabel="Delete video"
        loading={deleteBusy}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
