import { getDefaultStayDates } from "@stack/ui";
import { cacheLife } from "next/cache";

export async function getCachedDefaultStayDates() {
  "use cache";

  cacheLife({
    stale: 60,
    revalidate: 3600,
    expire: 86400,
  });

  return getDefaultStayDates();
}
