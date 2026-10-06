import { useEffect } from "react";
import { SITE } from "../config/site.js";

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;
  }, [title]);
}
