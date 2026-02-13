import { useEffect } from "react";

const SITE_NAME = "Rasta Collections";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Coins & Rocks`;
  }, [title]);
}
