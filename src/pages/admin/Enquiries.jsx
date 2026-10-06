import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";
import api, { getErrorMessage } from "../../lib/api.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import EnquiryDrawer from "../../components/admin/EnquiryDrawer.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { inputClass } from "../../components/ui/Field.jsx";
import useTitle from "../../hooks/useTitle.js";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS } from "../../lib/status.js";
import { formatPreferred, timeAgo } from "../../lib/format.js";

export default function Enquiries() {
  useTitle("Enquiries");
  const { refreshCounts } = useOutletContext();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadStats = useCallback(() => {
    api.get("/admin/enquiries/stats").then((r) => setStats(r.data.data)).catch(() => {});
    refreshCounts();
  }, [refreshCounts]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/enquiries", {
        params: { page, limit: 15, status: status || undefined, search: search || undefined },
      });
      setItems(data.data);
      setPages(data.pagination.pages);
      setError("");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleSaved = (updated) => {
    setSelected(updated);
    setItems((list) => list.map((x) => (x._id === updated._id ? updated : x)));
    loadStats();
    if (status && updated.status !== status) load(); // it no longer matches the current filter
  };

  const handleDeleted = () => {
    setSelected(null);
    if (items.length === 1 && page > 1) setPage(page - 1);
    else load();
    loadStats();
  };

  const tabs = [
    { value: "", label: "All", count: stats?.total },
    ...ENQUIRY_STATUSES.map((s) => ({ value: s, label: ENQUIRY_STATUS[s].label, count: stats?.[s] })),
  ];

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Meeting requests sent from your website's contact form." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-[4px] border border-line bg-panel p-0.5" role="group" aria-label="Filter by status">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={status === t.value}
              onClick={() => { setStatus(t.value); setPage(1); }}
              className={`flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-sm font-semibold transition-colors ${
                status === t.value ? "bg-ink text-paper" : "text-mute hover:text-ink"
              }`}
            >
              {t.label}
              {t.count != null && <span className="tabular text-xs opacity-70">{t.count}</span>}
            </button>
          ))}
        </div>
        <div className="relative min-w-[14rem] flex-1 sm:ml-auto sm:max-w-xs sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email or message"
            aria-label="Search enquiries"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      {error ? (
        <EmptyState title="Couldn't load enquiries" text={error} action={<Button variant="outline" onClick={load}>Try again</Button>} />
      ) : loading && items.length === 0 ? (
        <div className="grid place-items-center py-24 text-mute"><Spinner className="size-6" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          title={search || status ? "No enquiries match" : "No enquiries yet"}
          text={search || status ? "Try a different search or filter." : "When someone fills in the contact form on your website, it will show up here."}
        />
      ) : (
        <ul className={`overflow-hidden rounded-xl border border-line bg-panel transition-opacity ${loading ? "opacity-60" : ""}`}>
          {items.map((q) => (
            <li key={q._id} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onClick={() => setSelected(q)}
                className="grid w-full gap-x-6 gap-y-1.5 px-5 py-4 text-left hover:bg-ink/4 md:grid-cols-[1.1fr_1.6fr_1fr_auto] md:items-center"
              >
                <div className="min-w-0">
                  <p className={`flex items-center gap-2 truncate ${q.status === "new" ? "font-bold" : "font-semibold"}`}>
                    {q.status === "new" && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-chroma" />}
                    <span className="truncate">{q.name}</span>
                  </p>
                  <p className="truncate text-sm text-mute">{q.email}</p>
                </div>
                <p className="line-clamp-2 text-[0.95rem] text-ink/80">{q.message}</p>
                <div className="text-sm">
                  <p className="font-semibold">{formatPreferred(q.preferredDate)}</p>
                  <p className="text-mute">Received {timeAgo(q.createdAt)}</p>
                </div>
                <div className="md:justify-self-end"><Badge value={q.status} /></div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} className="mt-6" />

      <EnquiryDrawer enquiry={selected} onClose={() => setSelected(null)} onSaved={handleSaved} onDeleted={handleDeleted} />
    </>
  );
}
