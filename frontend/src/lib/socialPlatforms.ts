import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

// The platforms with their own icon. Any other platform name is a custom platform and
// uses a generic globe icon (see Footer.tsx and the admin Social Links card).
export const socialPlatforms: { value: string; Icon: IconType }[] = [
  { value: "Facebook", Icon: FaFacebook },
  { value: "Instagram", Icon: FaInstagram },
  { value: "LinkedIn", Icon: FaLinkedin },
  { value: "YouTube", Icon: FaYoutube },
  { value: "TikTok", Icon: FaTiktok },
  { value: "X", Icon: FaXTwitter },
  { value: "WhatsApp", Icon: FaWhatsapp },
  { value: "Telegram", Icon: FaTelegram },
  { value: "GitHub", Icon: FaGithub },
];

// The matching known platform name (case-insensitive; "Twitter" is X), or undefined.
export function knownPlatform(platform: string): string | undefined {
  const name = platform.trim().toLowerCase();

  if (name === "twitter") return "X";

  return socialPlatforms.find((item) => item.value.toLowerCase() === name)
    ?.value;
}

export function platformIcon(platform: string): IconType | undefined {
  const known = knownPlatform(platform);

  return socialPlatforms.find((item) => item.value === known)?.Icon;
}
