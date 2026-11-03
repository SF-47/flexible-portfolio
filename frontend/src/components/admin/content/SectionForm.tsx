import HeroForm from "./forms/HeroForm";
import AboutForm from "./forms/AboutForm";
import StatsForm from "./forms/StatsForm";
import ServicesForm from "./forms/ServicesForm";
import ProjectsForm from "./forms/ProjectsForm";
import WhyChooseUsForm from "./forms/WhyChooseUsForm";
import ProcessForm from "./forms/ProcessForm";
import GalleryForm from "./forms/GalleryForm";
import TeamForm from "./forms/TeamForm";
import ClientsForm from "./forms/ClientsForm";
import TestimonialsForm from "./forms/TestimonialsForm";
import CertificationsForm from "./forms/CertificationsForm";
import FAQForm from "./forms/FAQForm";
import CTAForm from "./forms/CTAForm";
import ContactForm from "./forms/ContactForm";
import type { FormProps } from "./forms/types";

// Picks the form for a section type. It contains no fields of its own.
export default function SectionForm({
  type,
  ...props
}: FormProps & { type: string }) {
  switch (type) {
    case "hero":
      return <HeroForm {...props} />;

    case "about":
      return <AboutForm {...props} />;

    case "stats":
      return <StatsForm {...props} />;

    case "services":
      return <ServicesForm {...props} />;

    case "projects":
      return <ProjectsForm {...props} />;

    case "whyChooseUs":
      return <WhyChooseUsForm {...props} />;

    case "process":
      return <ProcessForm {...props} />;

    case "gallery":
      return <GalleryForm {...props} />;

    case "team":
      return <TeamForm {...props} />;

    case "clients":
      return <ClientsForm {...props} />;

    case "testimonials":
      return <TestimonialsForm {...props} />;

    case "certifications":
      return <CertificationsForm {...props} />;

    case "faq":
      return <FAQForm {...props} />;

    case "cta":
      return <CTAForm {...props} />;

    case "contact":
      return <ContactForm {...props} />;

    default:
      return <p>Editing is not supported for this section.</p>;
  }
}
