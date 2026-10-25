import type { Metadata } from "next";

import ServicesManager from "@/components/admin/catalog/ServicesManager";
import { getAdminCompanyServices } from "@/lib/companyServices";
import { getMedia } from "@/lib/media";

export const metadata: Metadata = { title: "Service Cards" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, media] = await Promise.all([
    getAdminCompanyServices(),
    getMedia(),
  ]);

  return <ServicesManager initialServices={services} initialMedia={media} />;
}
