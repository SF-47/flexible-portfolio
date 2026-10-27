import type { Metadata } from "next";

import ServicesManager from "@/components/admin/catalog/ServicesManager";
import { getAdminCompanyServices } from "@/lib/api/companyServices";
import { getMedia } from "@/lib/api/media";
import { requireAdminSession } from "@/lib/api/admin/client";

export const metadata: Metadata = { title: "Service Cards" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await requireAdminSession();

  const [services, media] = await Promise.all([
    getAdminCompanyServices(),
    getMedia(),
  ]);

  return <ServicesManager initialServices={services} initialMedia={media} />;
}
