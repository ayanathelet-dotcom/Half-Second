import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CircleAlert, FileVideo, Upload } from "lucide-react";
import api, { getErrorMessage } from "../../lib/api.js";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import { Field, inputClass } from "../ui/Field.jsx";
import { SITE } from "../../config/site.js";
import { formatBytes } from "../../lib/format.js";

export default function UploadVideoModal({ open, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("published");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (open) {
      setFile(null); setName(""); setDescription(""); setStatus("published");
      setProgress(0); setUploading(false); setError(""); setDrag(false);
    }
  }, [open]);

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) return setError("That isn't a video file. Choose an MP4, MOV or WebM.");
    if (f.size > SITE.maxVideoMB * 1024 * 1024) return setError(`That file is ${formatBytes(f.size)}. The limit is ${SITE.maxVideoMB} MB.`);
    setError("");
    setFile(f);
    if (!name.trim()) setName(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Choose a video to upload.");
    if (!name.trim()) return setError("Give the video a name.");
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("status", status);
      fd.append("video", file); // the file goes last
      await api.post("/admin/videos", fd, {
        onUploadProgress: (ev) => ev.total && setProgress(Math.round((ev.loaded / ev.total) * 100)),
      });
      toast.success(status === "published" ? "Video uploaded and published" : "Video uploaded as a draft");
      onUploaded();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Upload failed. Please try again."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload video" locked={uploading}>
      <form onSubmit={submit} className="space-y-5 px-5 py-5 sm:px-6">
        <div>
          <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
            className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              drag ? "border-chroma bg-chroma/5" : "border-line bg-white hover:border-ink/40"
            }`}
          >
            {file ? (
              <>
                <FileVideo className="size-8 text-chroma" />
                <span className="max-w-full truncate font-semibold">{file.name}</span>
                <span className="text-sm text-mute">{formatBytes(file.size)}. Click to choose a different file.</span>
              </>
            ) : (
              <>
                <Upload className="size-8 text-mute" />
                <span className="font-semibold">Drop a video here, or click to browse</span>
                <span className="text-sm text-mute">MP4, MOV or WebM, up to {SITE.maxVideoMB} MB</span>
              </>
            )}
          </button>
        </div>

        <Field label="Name" htmlFor="v-name">
          <input id="v-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} disabled={uploading} />
        </Field>
        <Field label="Description" htmlFor="v-desc" hint="Optional. Shown under the video on your website.">
          <textarea id="v-desc" rows={3} className={`${inputClass} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} disabled={uploading} />
        </Field>
        <Field label="Visibility" htmlFor="v-status">
          <select id="v-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)} disabled={uploading}>
            <option value="published">Published: visible on your website</option>
            <option value="draft">Draft: only visible here</option>
          </select>
        </Field>

        {uploading && (
          <div role="status">
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full bg-chroma transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="tabular mt-2 text-sm text-mute">
              {progress < 100 ? `Uploading ${progress}%` : "Finishing up. Large videos can take a minute."}
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-[4px] bg-danger/10 px-3.5 py-3 text-sm font-semibold text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button type="submit" loading={uploading}>Upload video</Button>
        </div>
      </form>
    </Modal>
  );
}
