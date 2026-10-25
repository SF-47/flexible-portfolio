import { createContext } from "react";

import type { MediaAsset } from "@/types/media";

// The Media Library images, shared with every image field in the editor.
export const MediaContext = createContext<{
  media: MediaAsset[];
  onUploaded: (asset: MediaAsset) => void;
}>({
  media: [],
  onUploaded: () => {},
});
