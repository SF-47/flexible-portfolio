export type Theme = {
  id: number;
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  onPrimaryColor: string;
  onAccentColor: string;
  headingFont: string;
  bodyFont: string;
  navbarVariant: string;
  isActive: boolean;
  isCustom: boolean;
};

// The editable part of a theme, as accepted by PUT /api/admin/themes/{id}.
export type ThemeConfig = Pick<
  Theme,
  | "primaryColor"
  | "accentColor"
  | "backgroundColor"
  | "textColor"
  | "onPrimaryColor"
  | "onAccentColor"
  | "headingFont"
  | "bodyFont"
  | "navbarVariant"
>;
