import { docs } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";
import * as Icons from "lucide-react";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) return;

    // Handle emoji icons
    if (icon.length <= 2) {
      return icon;
    }

    // Handle Lucide React icons
    const IconComponent = Icons[icon as keyof typeof Icons];
    if (IconComponent) {
      return createElement(IconComponent as React.ElementType, { size: 16 });
    }

    return;
  },
});
