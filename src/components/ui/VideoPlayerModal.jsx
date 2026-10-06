import { useRef } from "react";
import Modal from "./Modal.jsx";

export default function VideoPlayerModal({ video, onClose }) {
  // keep the last video while the close animation plays
  const last = useRef(video);
  if (video) last.current = video;
  const v = last.current;

  return (
    <Modal open={!!video} onClose={onClose} size="xl" dark hideHeader title={v?.name || "Video"}>
      {v && (
        <>
          <video
            key={v._id}
            src={v.video?.url}
            poster={v.video?.thumbnailUrl}
            controls
            autoPlay
            playsInline
            className="aspect-video max-h-[72vh] w-full bg-black"
          />
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <h3 className="text-xl font-bold">{v.name}</h3>
            {v.description && (
              <p className="mt-2 max-w-2xl whitespace-pre-line text-[0.95rem] leading-relaxed text-mute-dark">
                {v.description}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
