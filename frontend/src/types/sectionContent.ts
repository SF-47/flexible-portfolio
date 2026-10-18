export type HeroContent = {
  tagline: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export type AboutContent = {
  label: string;
  title: string;
  description: string;
  secondDescription: string;
  linkText: string;
  linkUrl: string;
  imageMediaId: number | null;
  imageAlt: string;
};

export type StatsContent = {
  items: {
    value: string;
    label: string;
  }[];
};

export type ServicesContent = {
  label: string;
  title: string;
  description: string;
};

export type ProjectsContent = {
  label: string;
  title: string;
};

export type WhyChooseUsContent = {
  label: string;
  title: string;
  description: string;
  items: {
    icon: string;
    title: string;
    description: string;
  }[];
};

export type ProcessContent = {
  label: string;
  title: string;
  description: string;
  steps: {
    number: string;
    icon: string;
    title: string;
    description: string;
  }[];
};

export type GalleryContent = {
  label: string;
  title: string;
  description: string;
  icon: string;
  items: {
    title: string;
    category: string;
    imageMediaId: number | null;
    featured: boolean;
  }[];
};

export type TeamContent = {
  label: string;
  title: string;
  description: string;
  members: {
    name: string;
    position: string;
    description: string;
    imageMediaId: number | null;
  }[];
};

export type ClientsContent = {
  label: string;
  title: string;
  description: string;
  items: {
    name: string;
    icon: string;
  }[];
};

export type TestimonialsContent = {
  label: string;
  title: string;
  description: string;
  items: {
    name: string;
    role: string;
    initials: string;
    rating: number;
    message: string;
  }[];
};

export type CertificationsContent = {
  label: string;
  title: string;
  description: string;
  items: {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
  }[];
};

export type FAQContent = {
  label: string;
  title: string;
  description: string;
  helpIcon: string;
  helpTitle: string;
  helpLinkText: string;
  helpLinkUrl: string;
  items: {
    question: string;
    answer: string;
  }[];
};

export type CTAContent = {
  label: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
};

export type ContactContent = {
  label: string;
  title: string;
  description: string;
  addressTitle: string;
  phoneTitle: string;
  emailTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  buttonText: string;
};
