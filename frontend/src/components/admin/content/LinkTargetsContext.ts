import { createContext } from "react";

import type { SectionType } from "@/types/section";

// Which sections are currently visible on the website, for the link destination dropdowns.
export const LinkTargetsContext = createContext<
  { type: SectionType; isVisible: boolean }[]
>([]);
