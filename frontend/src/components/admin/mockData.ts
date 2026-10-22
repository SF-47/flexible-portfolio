// MOCK DATA: temporary sample content so the admin pages show how real data will look.
// To remove: delete this file and set the arrays in each admin page back to [].

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
