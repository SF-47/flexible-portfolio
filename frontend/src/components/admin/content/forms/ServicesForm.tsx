"use client";

import { useContext } from "react";

import CardsSummary from "../CardsSummary";
import { CatalogContext } from "../CatalogContext";
import { HeaderFields } from "../fields/TextField";
import type { FormProps } from "./types";

export default function ServicesForm({ draft, updateField }: FormProps) {
  const { services } = useContext(CatalogContext);

  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <CardsSummary
        heading="Service Cards"
        items={services.map((service) => ({
          id: service.id,
          title: service.title,
          note: service.isActive ? undefined : "Hidden",
        }))}
        max={6}
        href="/admin/services"
        buttonLabel="Manage Service Cards"
      />
    </>
  );
}
