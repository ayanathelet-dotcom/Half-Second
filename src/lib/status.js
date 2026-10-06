export const ENQUIRY_STATUSES = ["new", "contacted", "scheduled", "completed", "rejected"];

export const ENQUIRY_STATUS = {
  new: { label: "New", cls: "bg-chroma text-white" },
  contacted: { label: "Contacted", cls: "bg-signal text-ink" },
  scheduled: { label: "Scheduled", cls: "bg-ink text-paper" },
  completed: { label: "Completed", cls: "bg-ok/15 text-ok" },
  rejected: { label: "Rejected", cls: "bg-danger/12 text-danger" },
};

export const VIDEO_STATUS = {
  published: { label: "Published", cls: "bg-ok/15 text-ok" },
  draft: { label: "Draft", cls: "bg-ink/10 text-mute" },
};

export const container = "mx-auto w-full max-w-[88rem] px-5 sm:px-8";
