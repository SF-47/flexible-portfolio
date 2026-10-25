"use client";

import { useContext } from "react";

import CardsSummary from "../CardsSummary";
import { CatalogContext } from "../CatalogContext";
import { TextField } from "../fields/TextField";
import type { FormProps } from "./types";

export default function ProjectsForm({ draft, updateField }: FormProps) {
  const { projects } = useContext(CatalogContext);

  return (
    <>
      <TextField
        label="Label"
        value={draft.label}
        onChange={(v) => updateField("label", v)}
      />
      <TextField
        label="Title"
        value={draft.title}
        onChange={(v) => updateField("title", v)}
      />
      <CardsSummary
        heading="Project Cards"
        items={projects.map((project) => ({
          id: project.id,
          title: project.title,
          note: project.isFeatured ? "Featured" : undefined,
        }))}
        max={6}
        href="/admin/projects"
        buttonLabel="Manage Projects"
      />
    </>
  );
}
