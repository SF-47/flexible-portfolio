// MOCK DATA: temporary sample content so the admin pages show how real data will look.
// To remove: delete this file and set the arrays in each admin page back to [].

export const mockStats = [
  { label: "Sections", value: "15" },
  { label: "Projects", value: "3" },
  { label: "Services", value: "6" },
  { label: "Messages", value: "2" },
];

export const mockSections = [
  { id: "1", name: "Hero", type: "Hero", visible: true },
  { id: "2", name: "About Us", type: "About", visible: true },
  { id: "3", name: "Our Services", type: "Services", visible: true },
  { id: "4", name: "Contact", type: "Contact", visible: false },
];

export const mockContentSections = [
  {
    id: "hero",
    name: "Hero Section",
    heading: "Sample Company Headline",
    description: "A short sample description of the company and what it does.",
  },
  {
    id: "about",
    name: "About Section",
    heading: "About Sample Company",
    description: "Sample text describing the company history and values.",
  },
  {
    id: "services",
    name: "Services Section",
    heading: "What We Do",
    description: "Sample text introducing the company services.",
  },
];

export const mockEditor = {
  heading: "Sample Company Headline",
  tagline: "SAMPLE TAGLINE",
  description: "A short sample description of the company and what it does.",
  buttonText: "Learn More",
  primaryColor: "#1E293B",
  accentColor: "#F59E0B",
  heroLayout: "Standard",
};

export const mockThemes = [
  {
    name: "Sample Theme One",
    colors: ["#1E293B", "#F59E0B", "#FFFFFF", "#0F172A"],
    selected: true,
  },
  {
    name: "Sample Theme Two",
    colors: ["#14532D", "#EAB308", "#F8FAFC", "#052E16"],
    selected: false,
  },
  {
    name: "Sample Theme Three",
    colors: ["#1E3A8A", "#38BDF8", "#F1F5F9", "#172554"],
    selected: false,
  },
];

export const mockColors = [
  { label: "Primary", value: "#1E293B" },
  { label: "Accent", value: "#F59E0B" },
  { label: "Background", value: "#FFFFFF" },
  { label: "Text", value: "#0F172A" },
  { label: "Text on Primary", value: "#FFFFFF" },
  { label: "Text on Accent", value: "#1E293B" },
];

export const mockFonts = { heading: "Poppins", body: "Lato" };

export const mockNavbarLayouts = ["Default", "Centered", "Split"];

export const mockNavLinks = [
  { id: 1, label: "Home", destination: "#home", visible: true },
  { id: 2, label: "Services", destination: "#services", visible: true },
  { id: 3, label: "Contact", destination: "#contact", visible: false },
];

export const mockSocialLinks = [
  { platform: "Facebook", url: "facebook.com/sample-company" },
  { platform: "LinkedIn", url: "linkedin.com/company/sample-company" },
];

export const mockBrand = {
  companyName: "Sample Company",
  footerDescription: "A short sample footer description for the company.",
};

export const mockMedia = [
  { id: 1, name: "sample-photo-1.jpg", type: "JPG Image", size: "1.2 MB", src: "/images/about.jpg" },
  { id: 2, name: "sample-photo-2.jpg", type: "JPG Image", size: "2.0 MB", src: "/images/project-1.jpg" },
  { id: 3, name: "sample-photo-3.jpg", type: "JPG Image", size: "1.6 MB", src: "/images/project-2.jpg" },
];

export const mockMediaSummary = { storageUsed: "4.8 MB", format: "JPG" };

export const mockMessages = [
  {
    id: 1,
    name: "Sample Visitor",
    email: "visitor@example.com",
    subject: "General inquiry",
    message: "This is a sample message to show how an unread inquiry looks.",
    date: "October 12, 2026",
    isRead: false,
  },
  {
    id: 2,
    name: "Another Visitor",
    email: "another@example.com",
    subject: "Quotation request",
    message: "This is a sample message to show how a read inquiry looks.",
    date: "October 10, 2026",
    isRead: true,
  },
];
