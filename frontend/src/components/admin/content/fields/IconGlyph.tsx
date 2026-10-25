import { createElement } from "react";
import { Shapes } from "lucide-react";

import { resolveIcon } from "@/lib/icons";

// Shows the Lucide icon for a stored name. It pulls in the whole icon library, so
// it is only ever loaded lazily by IconField.
export default function IconGlyph({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  return createElement(resolveIcon(name, Shapes), {
    size,
    "aria-hidden": true,
  });
}
