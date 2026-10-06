import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import api, { getErrorMessage } from "../../lib/api.js";
import Modal from "../ui/Modal.jsx";
import Button, { buttonClasses } from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import { inputClass } from "../ui/Field.jsx";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS } from "../../lib/status.js";
import { formatDateTime, formatPreferred } from "../../lib/format.js";

export default function EnquiryDrawer({ enquiry, onClose, onSaved, onDeleted }) {
  const last = useRef(enquiry);
  if (enquiry) last.current = enquiry;
  const e = last.current;

  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // reset the form when a different enquiry is opened
  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status);
      setNotes(enquiry.internalNotes || "");
    }
  }, [enquiry?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = !!e && (status !== e.status || notes !== (e.internalNotes || ""));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/enquiries/${e._id}`, { status, internalNotes: notes });
      toast.success("Changes saved");
      onSaved(data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/enquiries/${e._id}`);
      toast.success("Enquiry deleted");
      setConfirm(false);
      onDeleted(e._id);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Modal open={!!enquiry} onClose={onClose} variant="drawer" title="Enquiry" locked={saving || confirm}>
        {e && (
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="display text-4xl">{e.name}</h3>
                <Badge value={e.status} />
              </div>
              <a href={`mailto:${e.email}`} className="mt-2 inline-block break-all font-semibold text-chroma hover:underline">
                {e.email}
              </a>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-line bg-white p-4 text-sm">
              <div>
                <dt className="text-mute">Wants to meet</dt>
                <dd className="mt-0.5 font-semibold">{formatPreferred(e.preferredDate)}</dd>
              </div>
              <div>
                <dt className="text-mute">Received</dt>
                <dd className="mt-0.5 font-semibold">{formatDateTime(e.createdAt)}</dd>
              </div>
            </dl>

            <div>
              <h4 className="text-sm font-semibold text-mute">Message</h4>
              <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed">{e.message}</p>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Status</legend>
              <div className="flex flex-wrap gap-2">
                {ENQUIRY_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() => setStatus(s)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      status === s ? "border-ink bg-ink text-paper" : "border-line bg-white text-mute hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {ENQUIRY_STATUS[s].label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold">Private notes</label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(ev) => setNotes(ev.target.value)}
                maxLength={3000}
                placeholder="Only you can see these. Visitors never do."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        )}

        {e && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-panel px-5 py-4 sm:px-6">
            <Button variant="ghost" className="!text-danger hover:!bg-danger/10" onClick={() => setConfirm(true)}>
              Delete
            </Button>
            <div className="flex gap-2">
              <a href={`mailto:${e.email}?subject=${encodeURIComponent("Re: your enquiry")}`} className={buttonClasses({ variant: "outline" })}>
                <Mail className="size-4" /> Reply
              </a>
              <Button onClick={save} loading={saving} disabled={!dirty}>
                Save changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirm}
        title="Delete this enquiry?"
        message={`The enquiry from ${e?.name || "this visitor"} will be permanently removed. This can't be undone.`}
        confirmLabel="Delete enquiry"
        loading={deleting}
        onConfirm={remove}
        onClose={() => setConfirm(false)}
      />
    </>
  );
}
