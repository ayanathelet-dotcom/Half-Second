import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../lib/api.js";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import { Field, inputClass } from "../ui/Field.jsx";

export default function EditVideoModal({ video, onClose, onSaved }) {
  const last = useRef(video);
  if (video) last.current = video;
  const v = last.current;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("published");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (video) {
      setName(video.name);
      setDescription(video.description || "");
      setStatus(video.status);
    }
  }, [video]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Give the video a name.");
    setSaving(true);
    try {
      await api.patch(`/admin/videos/${v._id}`, { name: name.trim(), description: description.trim(), status });
      toast.success("Changes saved");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!video} onClose={onClose} title="Edit video" locked={saving}>
      <form onSubmit={submit} className="space-y-5 px-5 py-5 sm:px-6">
        <Field label="Name" htmlFor="e-name">
          <input id="e-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        </Field>
        <Field label="Description" htmlFor="e-desc">
          <textarea id="e-desc" rows={4} className={`${inputClass} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
        </Field>
        <Field label="Visibility" htmlFor="e-status" hint="To replace the video file itself, delete this video and upload a new one.">
          <select id="e-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published: visible on your website</option>
            <option value="draft">Draft: only visible here</option>
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}
